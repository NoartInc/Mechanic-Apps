"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TransaksiSparepartHubs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.TransaksiSparepartHubs.belongsTo(models.TransaksiSpareparts, {
        as: "transaksiData",
        foreignKey: "transaksiSparepart",
        sourceKey: "id",
      });

      models.TransaksiSparepartHubs.belongsTo(models.Spareparts, {
        as: "sparepartData",
        foreignKey: "sparepart",
        sourceKey: "id",
      });
    }
  }
  TransaksiSparepartHubs.init(
    {
      transaksiSparepart: DataTypes.INTEGER,
      sparepart: DataTypes.INTEGER,
      jumlah: DataTypes.INTEGER,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TransaksiSparepartHubs",
      tableName: "TransaksiSparepartHubs"
    }
  );
  return TransaksiSparepartHubs;
};
