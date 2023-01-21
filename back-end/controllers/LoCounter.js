const { Op } = require("sequelize");
const { LoCounter } = require("../models");
const {
  getRequestData,
  getSearchConditions,
  paginatedData,
} = require("../utils/helper");

const dataRelations = ["perbaikanLo", "loUser"];

const searchable = ["status"];

const getRow = async (id) => {
  return await LoCounter.findByPk(id, {
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

    // Date Range Filter
    if (req.query?.filters?.dateRange) {
      const { startDate, endDate } = req.query?.filters?.dateRange;
      conditions = {
        ...conditions,
        createdAt: {
          [Op.between]: [`${startDate} 00:00:00`, `${endDate} 23:59:59`],
        },
      };
    } else {
      conditions = {
        ...conditions,
        createdAt: {
          [Op.between]: [
            `${moment().subtract(1, "months").format("YYYY-MM-DD")} 00:00:00`,
            `${moment().format("YYYY-MM-DD")} 23:59:59`,
          ],
        },
      };
    }

    const data = await LoCounter.findAndCountAll({
      attributes: {
        exclude: ["updatedAt"],
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
