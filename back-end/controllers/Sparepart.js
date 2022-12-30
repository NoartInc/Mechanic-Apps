const { Spareparts } = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
} = require("../utils/helper");

const dataRelations = [];

const searchable = ["namaBarang", "sparepart", "merk", "spesifikasi", "kategori"];

const getRow = async (id) => {
  return await Spareparts.findByPk(id, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
    // include: dataRelations,
  });
};

const concatSparepart = (req) => {
    const {namaBarang, merk, spesifikasi} = req.body;
    const sparepart = `${namaBarang} ${merk} ${spesifikasi}`;
    return sparepart;
}

// Get all data
exports.findAll = async (req, res) => {
  try {
    let conditions = getSearchConditions(req, searchable);
    const request = getRequestData(req, {
      orderBy: "id",
      orderDir: "ASC",
    });
    const data = await Spareparts.findAndCountAll({
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
    const sparepart = concatSparepart(req);
    const data = await Spareparts.create({
        ...req.body,
        sparepart
    });
    res.json({
      message: "Sparepart Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const sparepart = concatSparepart(req);
    await Spareparts.update({
        ...req.body,
        sparepart
    }, {
      where: { id: req.params.id },
    });
    res.json({
      message: "Sparepart Updated successfully",
      data: await getRow(req.params.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Spareparts.destroy({
      where: { id: req.params.id },
    });
    res.json({ message: "Sparepart Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};
