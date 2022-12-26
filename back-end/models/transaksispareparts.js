"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransaksiSpareparts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TransaksiSpareparts.init(
    {
      noReferensi: DataTypes.STRING,
      supplier: DataTypes.STRING,
      name: DataTypes.STRING,
      date: DataTypes.DATE,
      type: DataTypes.ENUM("in", "out"),
      status: DataTypes.ENUM("update", "adjust"),
    },
    {
      sequelize,
      modelName: "TransaksiSpareparts",
    }
  );
  return TransaksiSpareparts;
};
