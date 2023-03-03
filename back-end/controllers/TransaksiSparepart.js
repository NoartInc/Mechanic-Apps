const {
  TransaksiSpareparts,
  Spareparts,
  GudangMechanics,
  TransaksiSparepartHubs,
} = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
  exportData,
} = require("../utils/helper");
const { Op } = require("sequelize");

const dataRelations = [
  {
    association: "sparepartDetail",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    through: {
      as: "transaksispareparthubs",
      attributes: ["jumlah", "harga"],
    },
  },
  {
    association: "sparepartHubs",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "pengguna",
    attributes: {
      exclude: ["createdAt", "updatedAt", "password"],
    },
  },
];

const searchable = [
  "noReferensi",
  "supplier",
  "name",
  "date",
  "type",
  "status",
];

const getRow = async (id) => {
  return await TransaksiSpareparts.findByPk(id, {
    attributes: {
      exclude: ["updatedAt", "date"],
    },
    include: dataRelations,
  });
};

// Get all data
exports.findAll = async (req, res) => {
  try {
    let conditions = getSearchConditions(req, searchable);
    const request = getRequestData(req, {
      orderBy: "id",
      orderDir: "ASC",
    });

    // Date Range Filter
    if (request?.filters?.dateRange) {
      const { startDate, endDate } = request?.filters?.dateRange;
      conditions = {
        ...conditions,
        createdAt: {
          [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
        },
      };
    }

    const data = await TransaksiSpareparts.findAndCountAll({
      attributes: {
        exclude: ["updatedAt", "date"],
      },
      distinct: true,
      where: conditions,
      include: dataRelations,
      order: [[request.orderby, request.orderdir]],
      limit: Number(request.limit),
      offset: Number(request.offset),
    });
    res.json(paginatedData(data, request.limit));
  } catch (err) {
    res.json({ message: err.message });
  }
};

// Get single data
exports.findOne = async (req, res) => {
  try {
    const data = await getRow(req.params.id);
    res.json(data);
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { sparepartHubs } = req.body;
    const user = req.user;
    const data = await TransaksiSpareparts.create(
      {
        ...req.body,
        user: user?.id,
        sparepartHubs: req.body.sparepartHubs.map((item) => ({
          sparepart: item?.sparepart,
          jumlah: item?.jumlah,
          harga: item?.harga,
        })),
      },
      {
        include: [{ association: "sparepartHubs" }],
      }
    ).then(async (result) => {
      await sparepartHubs.forEach(async (item) => {
        const sparepart = await Spareparts.findByPk(item.sparepart);
        if (sparepart) {
          await Spareparts.update(
            {
              stok:
                result.type === "in"
                  ? sparepart.stok + item.jumlah
                  : sparepart.stok - item.jumlah,
            },
            {
              where: { id: item.sparepart },
            }
          );
        }

        if (result.type === "out") {
          const gudangmekanik = await GudangMechanics.findOne({
            where: { sparepart: sparepart.sparepart },
          });

          // kalau ada datanya
          // update
          if (gudangmekanik) {
            GudangMechanics.update(
              {
                merk: sparepart.merk,
                stok: gudangmekanik.stok + item.jumlah,
                namaBarang: sparepart.namaBarang,
                spesifikasi: sparepart.spesifikasi,
                kategori: sparepart.kategori,
              },
              {
                where: {
                  sparepart: sparepart.sparepart,
                },
              }
            );
          } else {
            // kalau gak ada, insert
            GudangMechanics.create({
              sparepart: sparepart.sparepart,
              merk: sparepart.merk,
              stok: Number(item.jumlah),
              namaBarang: sparepart.namaBarang,
              spesifikasi: sparepart.spesifikasi,
              kategori: sparepart.kategori,
            });
          }
        }
      });
      return result;
    });
    res.json({
      message: "Transaksi Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = req.user;
    await TransaksiSpareparts.update(
      {
        noReferensi: req.body.noReferensi,
        supplier: req.body.supplier,
        name: req.body.name,
        type: req.body.type,
        status: req.body.status,
        user: user?.id,
      },
      {
        where: { id: req.params.id },
      }
    );

    // Ambil data jumlah sebelumnya
    const oldHubs = await TransaksiSparepartHubs.findAll({
      where: { transaksiSparepart: req.params.id },
      raw: true,
    });

    for await (const item of oldHubs) {
      Spareparts.findByPk(item?.sparepart, { raw: true }).then(
        (oldSparepart) => {
          Spareparts.update(
            {
              stok:
                req.body.type === "in"
                  ? oldSparepart.stok - item?.jumlah
                  : oldSparepart.stok + item?.jumlah,
            },
            {
              where: { id: item?.sparepart },
            }
          );
          if (req.body.type === "out") {
            GudangMechanics.findAll({
              where: { sparepart: oldSparepart?.sparepart },
              raw: true,
            }).then((gudang) => {
              const oldGudang = gudang[0];
              GudangMechanics.update(
                {
                  stok: oldGudang.stok - item?.jumlah,
                },
                {
                  where: { sparepart: oldSparepart.sparepart },
                }
              );
            });
          }
        }
      );
    }

    await TransaksiSparepartHubs.destroy({
      where: { transaksiSparepart: req.params.id },
    });

    for await (const item of req.body.sparepartHubs) {
      TransaksiSparepartHubs.create({
        transaksiSparepart: req.params.id,
        sparepart: item?.sparepart,
        jumlah: item?.jumlah,
        harga: item?.harga,
      }).then((newHub) => {
        Spareparts.findByPk(newHub.sparepart, {
          raw: true,
        }).then((sparepart) => {
          Spareparts.update(
            {
              stok:
                req.body.type === "in"
                  ? sparepart.stok + newHub.jumlah
                  : sparepart.stok - newHub.jumlah,
            },
            {
              where: { id: newHub.sparepart },
            }
          );
          if (req.body.type === "out") {
            GudangMechanics.findAll({
              where: { sparepart: sparepart.sparepart },
              raw: true,
            }).then((gudang) => {
              const gudangMekanik = gudang[0];
              if (gudangMekanik) {
                GudangMechanics.update(
                  {
                    stok: gudangMekanik.stok + newHub.jumlah,
                  },
                  {
                    where: { sparepart: sparepart.sparepart },
                  }
                );
              } else {
                GudangMechanics.create({
                  sparepart: sparepart.sparepart,
                  merk: sparepart.merk,
                  stok: Number(newHub.jumlah),
                  namaBarang: sparepart.namaBarang,
                  spesifikasi: sparepart.spesifikasi,
                  kategori: sparepart.kategori,
                });
              }
            });
          }
        });
      });
    }

    res.json({
      message: "Transaksi Updated successfully",
      data: await getRow(req.params.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const transaksiSparepart = await TransaksiSpareparts.findByPk(
      req.params.id,
      {
        raw: true,
      }
    );
    const sparepartHubs = await TransaksiSparepartHubs.findAll({
      where: { transaksiSparepart: req.params.id },
      raw: true,
    });

    // Jika type IN, sebelum dihapus di tabel sparepartHub
    // Maka jumlah di tabel sparepart dikurangi dengan jumlah yang ada di spareparthub
    if (transaksiSparepart.type === "in") {
      sparepartHubs.map(async (item) => {
        const sparepart = await Spareparts.findByPk(item?.sparepart, {
          raw: true,
        });
        await Spareparts.update(
          {
            stok: sparepart?.stok - item?.jumlah,
          },
          {
            where: { id: sparepart?.id },
          }
        );
      });
    }

    // Jika type OUT, sebelum dihapus di tabel sparepartHub
    // Maka jumlah di tabel gudangmekanik dikurangi dengan jumlah yang ada di spareparthub
    // dan ditambahkan ke stok tabel sparepart
    if (transaksiSparepart.type === "out") {
      sparepartHubs.map(async (item) => {
        const sparepart = await Spareparts.findByPk(item?.sparepart, {
          raw: true,
        });
        const gudangMekanik = await GudangMechanics.findAll({
          where: { sparepart: sparepart?.sparepart },
          raw: true,
        });

        // Kurangin stok di gudangMekanik dengan jumlah yang ada di item (sparepartHub)
        await GudangMechanics.update(
          {
            stok: gudangMekanik[0]?.stok - item?.jumlah,
          },
          {
            where: { sparepart: sparepart?.sparepart },
          }
        );

        // Tambahkan stok di tabel sparepart dengan jumlah yang ada di item (sparepartHub)
        await Spareparts.update(
          {
            stok: sparepart?.stok + item?.jumlah,
          },
          {
            where: { id: sparepart?.id },
          }
        );
      });
    }

    await TransaksiSparepartHubs.destroy({
      where: { transaksiSparepart: req.params.id },
    });
    await TransaksiSpareparts.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Transaksi Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const conditions = {};
    const request = getRequestData(req, {
      orderBy: "transaksiSparepart",
      orderDir: "desc",
    });
    const { startDate, endDate } = request.filters?.dateRange;

    conditions.createdAt = {
      [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
    };

    const data = await TransaksiSparepartHubs.findAll({
      where: conditions,
      attributes: ["jumlah", "harga"],
      include: [
        {
          association: "transaksiData",
          attributes: [
            "noReferensi",
            "supplier",
            "name",
            "type",
            "status",
            "createdAt",
          ],
        },
        {
          association: "sparepartData",
          attributes: ["sparepart", "merk", "spesifikasi", "kategori"],
        },
      ],
      order: [[request.orderby, request.orderdir]],
    });

    const columns = [
      {
        header: "No. Referensi",
        key: "noReferensi",
        width: "15",
      },
      {
        header: "Tanggal",
        key: "createdAt",
        width: "15",
      },
      {
        header: "Nama",
        key: "name",
        width: "20",
      },
      {
        header: "Supplier",
        key: "supplier",
        width: "20",
      },
      {
        header: "Tipe",
        key: "type",
        width: "10",
      },
      {
        header: "Status",
        key: "status",
        width: "10",
      },
      {
        header: "Sparepart",
        key: "sparepart",
        width: "20",
      },
      {
        header: "Merk",
        key: "merk",
        width: "15",
      },
      {
        header: "Spesifikasi",
        key: "spesifikasi",
        width: "15",
      },
      {
        header: "Kategori",
        key: "kategori",
        width: "15",
      },
      {
        header: "Jumlah",
        key: "jumlah",
        width: "10",
      },
      {
        header: "Harga",
        key: "harga",
        width: "15",
      },
    ];

    const rows = await data.map((item) => ({
      noReferensi: item?.transaksiData?.noReferensi,
      createdAt: item?.transaksiData?.createdAt,
      name: item?.transaksiData?.name,
      supplier: item?.transaksiData?.supplier,
      type: item?.transaksiData?.type,
      status: item?.transaksiData?.status,
      sparepart: item?.sparepartData?.sparepart,
      merk: item?.sparepartData?.merk,
      spesifikasi: item?.sparepartData?.spesifikasi,
      kategori: item?.sparepartData?.kategori,
      jumlah: item?.jumlah,
      harga: item?.harga,
    }));

    const result = await exportData("Transaksi Sparepart", columns, rows);

    return res.json({
      status: true,
      path: result,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      error: error,
    });
  }
};
