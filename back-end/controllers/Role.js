const { Roles, RoleAccess } = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
} = require("../utils/helper");

const dataRelations = [
  {
    association: "userRoles",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
  {
    association: "roleAccess",
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  },
];

const searchable = ["roleName"];

const getRow = async (id) => {
  return await Roles.findByPk(id, {
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
      orderBy: "roleName",
      orderDir: "ASC",
    });
    const data = await Roles.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
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
    // Create role dengan role access'nya
    // lihat request body pada postman
    const data = await Roles.create(req.body, {
      include: [{ association: "roleAccess" }],
    });
    res.json({
      message: "Role Created successfully",
      data: await getRow(data?.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Hapus dulu role access dengan role id bersangkutan
    await RoleAccess.destroy({
      where: { role: req.params.id },
    });
    // Update data role'nya
    await Roles.update(req.body, {
      where: { id: req.params.id },
    }).then(() => {
      // Buat ulang role access'nya
      RoleAccess.bulkCreate(
        req.body.roleAccess.map((item) => ({
          ...item,
          role: req.params.id,
        }))
      );
    });
    res.json({
      message: "Role Updated successfully",
      data: await getRow(req.params.id),
    });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    // Hapus data role'nya
    await Roles.destroy({
      where: { id: req.params.id },
    });
    // Hapus data role access'nya
    await RoleAccess.destroy({
      where: { role: req.params.id },
    });
    res.json({ message: "Role Deleted successfully" });
  } catch (err) {
    res.json({ message: err.message });
  }
};

exports = { getRow };
