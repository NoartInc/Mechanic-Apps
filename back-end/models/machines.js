"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Machines extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Machines.init(
    {
      mesin: DataTypes.STRING,
      kategori: DataTypes.STRING,
      lokasi: DataTypes.STRING,
      merk: DataTypes.STRING,
      perbaikan: DataTypes.INTEGER,
      status: DataTypes.ENUM("active", "inactive"),
    },
    {
      sequelize,
      modelName: "Machines",
    }
  );
  return Machines;
};