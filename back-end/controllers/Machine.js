const { Machines } = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
} = require("../utils/helper");

const dataRelations = [];

const searchable = ["mesin", "kategori", "lokasi", "merk", "status"];

const getRow = async (id) => {
  return await Machines.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
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
    const data = await Machines.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      distinct: true,
      where: conditions,
      //   include: dataRelations,
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
    const data = await Machines.create(req.body);
    res.json({
      message: "Machine Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await Machines.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({
      message: "Machine Updated successfully",
      data: await getRow(req.params.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Machines.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Machine Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};
