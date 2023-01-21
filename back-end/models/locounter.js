'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LoCounter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.LoCounter.belongsTo(models.Perbaikans,{
        foreignKey: "perbaikan",
        sourceKey: "id",
        as: "perbaikanLo"
      })
      models.LoCounter.belongsTo(models.Users,{
        foreignKey: "user",
        sourceKey: "id",
        as: "loUser"
      })
    }
  }
  LoCounter.init({
    user: DataTypes.INTEGER,
    perbaikan: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'LoCounter',
  });
  return LoCounter;
};