const {
  TransaksiSpareparts,
  Spareparts,
  GudangMechanics,
} = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
} = require("../utils/helper");

const dataRelations = [
  {
    association: "sparepartDetail",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    through: {
      attributes: ["jumlah", "harga"],
    },
  },
  {
    association: "sparepartHubs",
    attributes: {
      exclude: ["createdAt", "updatedAt"]
    },
  }
];

const searchable = [
  "noReferensi",
  "supplier",
  "name",
  "date",
  "type",
  "adjust",
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
    const data = await TransaksiSpareparts.create(req.body, {
      include: [{ association: "sparepartHubs" }],
    }).then(async (result) => {
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
              stok: item.jumlah,
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
    await TransaksiSpareparts.update(req.body, {
      where: { id: req.params.id },
    });
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
    await TransaksiSpareparts.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Transaksi Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};
