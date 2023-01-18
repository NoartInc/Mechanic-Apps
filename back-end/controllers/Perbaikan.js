const {
  Perbaikans,
  PerbaikanSpareparts,
  PerbaikanMechanics,
  PerbaikanKerusakans,
  GudangMechanics,
} = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
  generateReportNumber,
} = require("../utils/helper");
const fs = require("fs");
const path = require("path");
const logging = require("../utils/logging");
const { Op } = require("sequelize");

const dataRelations = [
  {
    association: "pengguna",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "machine",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "mekaniks",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "spareparts",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "kerusakans",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "perbaikanMekaniks",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "perbaikanSpareparts",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "perbaikanKerusakans",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
];

const searchable = ["noLaporan"];

const getRow = async (id, include = true) => {
  return await Perbaikans.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    include: include ? dataRelations : null,
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

    // Mesin Filter
    if (request?.filters?.mesin) {
      conditions = {
        ...conditions,
        mesin: request?.filters?.mesin,
      };
    }

    const data = await Perbaikans.findAndCountAll({
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
    const user = req.user;
    const getLast = await Perbaikans.findOne({
      order: [["id", "desc"]],
      raw: true,
    });
    const lastId = getLast?.id ? getLast?.id : 1;
    const noLaporan = generateReportNumber(lastId);
    const data = await Perbaikans.create(
      {
        ...req.body,
        user: user?.id,
        status: "open",
        noLaporan,
      },
      {
        include: [
          { association: "perbaikanMekaniks" },
          { association: "perbaikanSpareparts" },
          { association: "perbaikanKerusakans" },
        ],
      }
    );

    // Kurangi Stok di gudang mekanik
    // sesuai jumlah yang di input pada perbaikanSpareparts
    for await (const item of req.body.perbaikanSpareparts) {
      GudangMechanics.findByPk(item?.gudangmekanik, { raw: true }).then(
        (gudangMekanik) => {
          GudangMechanics.update(
            {
              stok: gudangMekanik.stok - item?.jumlah,
            },
            {
              where: { id: gudangMekanik.id },
            }
          );
        }
      );
    }

    res.json({
      message: "Perbaikan Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    await Perbaikans.update(
      {
        status: req.body.status,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.json({
      status: true,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadPhoto = async (req, res) => {
  try {
    await Perbaikans.update(
      {
        uploadPhotos: req.file?.filename,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.removePhoto = async (req, res) => {
  try {
    const oldPhoto = await Perbaikans.findByPk(req.params.id, { raw: true });
    const filePath = path.resolve(
      path.join(__dirname, "../public/images/" + oldPhoto?.uploadPhotos)
    );
    fs.unlink(`${filePath}`, (err) => {
      if (err) throw err;
      logging(
        req.user?.fullName,
        "DELETE",
        `Delete File ${oldPhoto?.uploadPhotos}`
      );
    });
    await Perbaikans.update(
      {
        uploadPhotos: null,
      },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({
      status: true,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const user = req.user;
    await Perbaikans.update(
      {
        ...req.body,
        user: user?.id,
      },
      {
        where: { id: req.params.id },
      }
    ).then(async (result) => {
      if (result) {
        // Kembalikan stok ke gudang mekanik
        // sesuai jumlah yang ada di perbaikanSpareparts lama
        await PerbaikanSpareparts.findAll({
          where: { perbaikan: req.params.id },
          raw: true,
        }).then(async (result) => {
          for await (const item of result) {
            GudangMechanics.findByPk(item?.gudangmekanik, { raw: true }).then(
              (gudangMekanik) => {
                GudangMechanics.update(
                  {
                    stok: gudangMekanik.stok + item?.jumlah,
                  },
                  {
                    where: { id: gudangMekanik.id },
                  }
                );
              }
            );
          }
        });

        // Remove previous record
        await PerbaikanSpareparts.destroy({
          where: { perbaikan: req.params.id },
        });
        await PerbaikanMechanics.destroy({
          where: { perbaikan: req.params.id },
        });
        await PerbaikanKerusakans.destroy({
          where: { perbaikan: req.params.id },
        });

        // re-create record
        await PerbaikanSpareparts.bulkCreate(
          req.body.perbaikanSpareparts.map((item) => ({
            perbaikan: req.params.id,
            ...item,
          }))
        ).then(async () => {
          // Kurangi Stok di gudang mekanik
          // sesuai jumlah yang di input pada perbaikanSpareparts
          for await (const item of req.body.perbaikanSpareparts) {
            GudangMechanics.findByPk(item?.gudangmekanik, { raw: true }).then(
              (gudangMekanik) => {
                GudangMechanics.update(
                  {
                    stok: gudangMekanik.stok - item?.jumlah,
                  },
                  {
                    where: { id: gudangMekanik.id },
                  }
                );
              }
            );
          }
        });
        await PerbaikanMechanics.bulkCreate(
          req.body.perbaikanMekaniks.map((item) => ({
            perbaikan: req.params.id,
            ...item,
          }))
        );
        await PerbaikanKerusakans.bulkCreate(
          req.body.perbaikanKerusakans.map((item) => ({
            perbaikan: req.params.id,
            ...item,
          }))
        );
      }
    });
    res.json({
      message: "Perbaikan Updated successfully",
      data: await getRow(req.params.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const perbaikan = await getRow(req.params.id, false);
    await Perbaikans.destroy({
      where: { id: req.params.id },
    });

    logging(
      req.user?.fullName,
      "Delete",
      `Menghapus data perbaikan ${perbaikan?.noLaporan}`
    );

    // Kembalikan stok ke gudang mekanik
    // sesuai jumlah yang ada di perbaikanSpareparts lama
    await PerbaikanSpareparts.findAll({
      where: { perbaikan: req.params.id },
      raw: true,
    }).then(async (result) => {
      for await (const item of result) {
        GudangMechanics.findByPk(item?.gudangmekanik, { raw: true }).then(
          (gudangMekanik) => {
            GudangMechanics.update(
              {
                stok: gudangMekanik.stok + item?.jumlah,
              },
              {
                where: { id: gudangMekanik.id },
              }
            );
          }
        );
      }
    });

    await PerbaikanSpareparts.destroy({
      where: { perbaikan: req.params.id },
    });
    await PerbaikanMechanics.destroy({
      where: { perbaikan: req.params.id },
    });
    await PerbaikanKerusakans.destroy({
      where: { perbaikan: req.params.id },
    });

    res.json({ message: "Perbaikan Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};
