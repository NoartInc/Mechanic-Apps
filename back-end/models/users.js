"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Users.belongsTo(models.Roles, {
        as: "userRole",
        foreignKey: "role",
        targetKey: "id",
      });
    }
  }
  Users.init(
    {
      fullName: DataTypes.STRING,
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.INTEGER,
      jabatan: DataTypes.STRING,
      email: DataTypes.STRING,
      contact: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("active", "inactive"),
      },
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
