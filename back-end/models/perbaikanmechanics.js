'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PerbaikanMechanics extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PerbaikanMechanics.init({
    perbaikan: DataTypes.INTEGER,
    mekanik: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PerbaikanMechanics',
  });
  return PerbaikanMechanics;
};