const {
  Perbaikans,
  PerbaikanSpareparts,
  PerbaikanMechanics,
  PerbaikanKerusakans,
} = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
  generateReportNumber,
} = require("../utils/helper");

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

const getRow = async (id) => {
  return await Perbaikans.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
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
    const getLast = await Perbaikans.findAll({
      limit: 1,
      order: [["id", "desc"]],
    })[0];
    const lastId = getLast?.id ? getLast?.id : 1;
    const noLaporan = generateReportNumber(lastId);
    const data = await Perbaikans.create(
      {
        ...req.body,
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
    res.json({
      message: "Perbaikan Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Perbaikans.update(req.body, {
      where: { id: req.params.id },
    }).then(async (result) => {
      if (result) {
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
        );
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
    await Perbaikans.destroy({
      where: { id: req.params.id },
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
