const {
  Perbaikans,
  LoCounter,
  Spareparts,
  PerbaikanSpareparts,
} = require("../models");
const { Op, fn, col } = require("sequelize");

const getPerbaikanCount = async (status) => {
  return await Perbaikans.count({
    where: {
      status: status,
    },
  });
};

const getRejectedLo = async () => {
  return await LoCounter.count({
    where: {
      status: "reject",
    },
  });
};

const getLatestRejected = async () => {
  return await LoCounter.findAll({
    distinct: true,
    attributes: ["createdAt"],
    order: [["id", "desc"]],
    where: {
      status: "reject",
    },
    include: [
      {
        association: "perbaikanLo",
        attributes: ["noLaporan"],
      },
      {
        association: "loUser",
        attributes: ["fullName"],
      },
    ],
    limit: 10,
  });
};

// Berdasarkan data master sparepart, cari yang mau habis
const getAlmostOutOfStockSparepart = async () => {
  return await Spareparts.findAll({
    distinct: true,
    attributes: ["sparepart", "stok"],
    where: {
      stok: {
        [Op.lt]: 3,
      },
    },
    order: [["stok", "asc"]],
    limit: 10,
  });
};

// Berdasarkan pemakaian di Gudang Mekanik (tabel perbaikanspareparts)
const getMostUsedSparepart = async () => {
  return await PerbaikanSpareparts.findAll({
    distinct: true,
    attributes: [[fn("COUNT", col("gudangmekanik")), "usedCount"]],
    include: [
      {
        association: "gudangMekanikSparepart",
        attributes: ["sparepart"],
      },
    ],
    group: ["gudangmekanik"],
    order: [["usedCount", "desc"]],
    limit: 10,
  });
};

exports.getSummary = async (req, res) => {
  try {
    const awaitingStatus = await getPerbaikanCount("open");
    const revisionStatus = await getPerbaikanCount("revisi");
    const acceptedStatus = await getPerbaikanCount("accept");
    const rejectedStatusByLo = await getRejectedLo();
    const latestRejected = await getLatestRejected();
    const almostOutOfStockSparepart = await getAlmostOutOfStockSparepart();
    const mostUsedSparepart = await getMostUsedSparepart();

    return res.json({
      awaiting: awaitingStatus,
      revision: revisionStatus,
      accepted: acceptedStatus,
      rejected: rejectedStatusByLo,
      latestRejected: latestRejected,
      almostOutOfStock: almostOutOfStockSparepart,
      mostUsedSparepart: mostUsedSparepart,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      error: error,
    });
  }
};
