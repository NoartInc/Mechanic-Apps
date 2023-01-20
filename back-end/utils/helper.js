const moment = require("moment/moment");
const { Op } = require("sequelize");
const excelJS = require("exceljs");

const baseUrl =
  process.env.ENV !== "production"
    ? "http://localhost:3000" // local laptop server
    : "http://localhost:3000"; // production server / VPS /Hosting

const getImage = (file) => {
  if (file) {
    const { originalname } = file;
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let fileExtension = originalname.split(".").pop();
    let fileData = `${uniqueSuffix}.${fileExtension}`;
    return fileData;
  } else {
    return undefined;
  }
};

const getRequestData = (
  req,
  { orderBy = "id", orderDir = "desc", perPage = 25 }
) => {
  const {
    page = 1,
    limit = perPage ?? 25,
    orderby = orderBy,
    orderdir = orderDir,
    search = "",
    filters = req?.filters ? req?.filters : null,
  } = req.query;
  const offset = (page - 1) * limit;
  return {
    offset,
    page,
    limit,
    orderby,
    orderdir,
    search,
    filters,
  };
};

const paginatedData = (data, limit) => {
  const lastPage = Math.ceil(data.count / Number(limit));
  return {
    ...data,
    pageCount: lastPage,
  };
};

const getSearchConditions = (req, searchFields) => {
  let search = req.query.search;
  if (search) {
    let searchConditions = searchFields.map((item) => {
      return {
        [item]: {
          [Op.like]: `%${search}%`,
        },
      };
    });
    return {
      [Op.or]: searchConditions,
    };
  } else {
    return {};
  }
};

const generateReportNumber = (id, leading = "LP") => {
  return `${leading}${moment().format("YYYYMMDD")}-${id + 1}`;
};

const exportData = async (fileName = "Exported Data", columns, rows) => {
  const workbook = new excelJS.Workbook(); // Create a new workbook
  const worksheet = workbook.addWorksheet(fileName); // New Worksheet
  const path = "./public/files";

  worksheet.columns = columns;
  worksheet.addRows(rows);
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  const exportFileName = `${path}/${fileName}.xlsx`;
  await workbook.xlsx.writeFile(exportFileName);
  return exportFileName;
};

const countDiff = (timeSeconds) => {
  let duration = moment.duration(timeSeconds, "seconds");
  let weeks = duration.get("weeks");
  let days = duration.get("days");
  let hours = duration.get("hours");
  let minutes = duration.get("minutes");
  let result = "";

  if (!isNaN(weeks) && weeks > 0) {
    result += `${weeks} Minggu `;
  }

  if (!isNaN(days) && days > 0) {
    result += `${days} Hari `;
  }

  if (!isNaN(hours) && hours > 0) {
    result += `${hours} Jam `;
  }

  if (!isNaN(minutes) && minutes > 0) {
    result += `${minutes} Menit`;
  }

  return result ? result : "-";
};

const getTimeDiff = (start, end) => {
  let timeSeconds = moment(end).diff(moment(start), "seconds");
  return countDiff(timeSeconds);
};

const getTimeDuration = (seconds) => {
  return countDiff(seconds);
};

module.exports = {
  getImage,
  getRequestData,
  getSearchConditions,
  paginatedData,
  generateReportNumber,
  exportData,
  getTimeDiff,
  getTimeDuration,
  baseUrl
};


