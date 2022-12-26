"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Perbaikans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Perbaikans.init(
    {
      mesin: DataTypes.INTEGER,
      user: DataTypes.INTEGER,
      note: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      uploadPhotos: DataTypes.STRING,
      noLaporan: DataTypes.STRING,
      jenisPerbaikan: DataTypes.ENUM("repairment", "maintenance"),
    },
    {
      sequelize,
      modelName: "Perbaikans",
    }
  );
  return Perbaikans;
};
