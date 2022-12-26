'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Kerusakans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Kerusakans.init({
    kerusakan: DataTypes.STRING,
    poin: DataTypes.INTEGER,
    durasi: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Kerusakans',
  });
  return Kerusakans;
};