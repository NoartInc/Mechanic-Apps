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
<<<<<<< HEAD
        through: "PerbaikanMechanics", // tabel penghubung antara tabel transaksisparepart & sparepart
=======
        through: models.PerbaikanMechanics, // tabel penghubung antara tabel transaksisparepart & sparepart
>>>>>>> aa59f8cf3f06d41c77879195589df02de56d4f36
        as: "mekaniks", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "mekanik", // key di tabel transaksi transaksi
      });
      models.Perbaikans.belongsToMany(models.Mechanics, {
<<<<<<< HEAD
        through: "PerbaikanMechanics", // tabel penghubung antara tabel transaksisparepart & sparepart
=======
        through: models.PerbaikanMechanics, // tabel penghubung antara tabel transaksisparepart & sparepart
>>>>>>> aa59f8cf3f06d41c77879195589df02de56d4f36
        as: "mekanikList", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "mekanik", 
      });
      models.Perbaikans.belongsToMany(models.GudangMechanics, {
<<<<<<< HEAD
        through: "PerbaikanSpareparts", // tabel penghubung antara tabel transaksisparepart & sparepart
=======
        through: models.PerbaikanSpareparts, // tabel penghubung antara tabel transaksisparepart & sparepart
>>>>>>> aa59f8cf3f06d41c77879195589df02de56d4f36
        as: "spareparts", // digunakan saat memanggil relasi di controller
        foreignKey: "perbaikan", // key di tabel transaksispareparthubs
        otherKey: "gudangmekanik", // key di tabel transaksi transaksi
      });
      models.Perbaikans.belongsToMany(models.Kerusakans, {
<<<<<<< HEAD
        through: "PerbaikanKerusakans", // tabel penghubung antara tabel transaksisparepart & sparepart
=======
        through: models.PerbaikanKerusakans, // tabel penghubung antara tabel transaksisparepart & sparepart
>>>>>>> aa59f8cf3f06d41c77879195589df02de56d4f36
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
