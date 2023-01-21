"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerbaikanSpareparts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.PerbaikanSpareparts.belongsTo(models.GudangMechanics, {
        foreignKey: "gudangmekanik",
        sourceKey: "id",
        as: "gudangMekanikSparepart"
      })
    }
  }
  PerbaikanSpareparts.init(
    {
      perbaikan: DataTypes.INTEGER,
      gudangmekanik: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "PerbaikanSpareparts",
    }
  );
  return PerbaikanSpareparts;
};
