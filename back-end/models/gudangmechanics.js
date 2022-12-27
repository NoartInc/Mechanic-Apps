'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GudangMechanics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GudangMechanics.init({
    sparepart: DataTypes.STRING,
    namaBarang: DataTypes.STRING,
    merk: DataTypes.STRING,
    spesifikasi: DataTypes.STRING,
    kategori: DataTypes.STRING,
    stok: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GudangMechanics',
  });
  return GudangMechanics;
};