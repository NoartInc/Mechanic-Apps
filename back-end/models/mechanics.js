'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Mechanics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mechanics.init({
    mekanik: DataTypes.STRING,
    kontak: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Mechanics',
  });
  return Mechanics;
};