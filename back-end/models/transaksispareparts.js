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
      // ini model untuk lihat data saja
      models.TransaksiSpareparts.belongsToMany(models.Spareparts, {
        through: "TransaksiSparepartHubs", // tabel penghubung antara tabel transaksisparepart & sparepart
        as: "sparepartDetail", // digunakan saat memanggil relasi di controller
        foreignKey: "transaksiSparepart", // key di tabel transaksispareparthubs
        otherKey: "sparepart", // key di tabel transaksi transaksi
      });

      models.TransaksiSpareparts.belongsTo(models.Users, {
        as: "pengguna",
        foreignKey: "user",
        sourceKey: "id",
      });

      // model untuk create
      models.TransaksiSpareparts.hasMany(models.TransaksiSparepartHubs, {
        as: "sparepartHubs",
        sourceKey: "id",
        foreignKey: "transaksiSparepart",
      });
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
      user: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TransaksiSpareparts",
    }
  );
  return TransaksiSpareparts;
};
