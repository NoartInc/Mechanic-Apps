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

      // Data View Relations
      models.Perbaikans.belongsTo(models.Users, {
        as: "pengguna",
        foreignKey: "user", // key yang ada di tabel perbaikan
        targetKey: "id", // id di tabel user (primary key di tabel user)
      });
      models.Perbaikans.belongsTo(models.Machines, {
        as: "machine",
        foreignKey: "mesin",
        targetKey: "id", // id di tabel mesin
      });
      models.Perbaikans.belongsToMany(models.Mechanics, {
        through: "perbaikanmechanics", // tabel penghubung antara tabel transaksisparepart & sparepart
        as: "mekaniks", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "mekanik", // key di tabel transaksi transaksi
      });
      models.Perbaikans.belongsToMany(models.GudangMechanics, {
        through: "perbaikanspareparts", // tabel penghubung antara tabel transaksisparepart & sparepart
        as: "spareparts", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "gudangmekanik", // key di tabel transaksi transaksi
      });
      models.Perbaikans.belongsToMany(models.Kerusakans, {
        through: "perbaikankerusakans", // tabel penghubung antara tabel transaksisparepart & sparepart
        as: "kerusakans", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "kerusakan", // key di tabel transaksi transaksi
      });

      // Data Action Relation
      models.Perbaikans.hasMany(models.PerbaikanMechanics, {
        as: "perbaikanMekaniks",
        sourceKey: "id",
        foreignKey: "perbaikan",
      });
      models.Perbaikans.hasMany(models.PerbaikanSpareparts, {
        as: "perbaikanSpareparts",
        sourceKey: "id",
        foreignKey: "perbaikan",
      });
      models.Perbaikans.hasMany(models.PerbaikanKerusakans, {
        as: "perbaikanKerusakans",
        sourceKey: "id",
        foreignKey: "perbaikan",
      });
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
      status: DataTypes.ENUM("proses","open", "revisi", "reject", "accept"),
    },
    {
      sequelize,
      modelName: "Perbaikans",
    }
  );
  return Perbaikans;
};
