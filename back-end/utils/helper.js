const { Op } = require("sequelize");

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
    filters = {},
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

module.exports = {
  getImage,
  getRequestData,
  getSearchConditions,
  paginatedData,
};
