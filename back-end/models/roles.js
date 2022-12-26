"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Roles.hasMany(models.RoleAccess, {
        as: "roleAccess",
        sourceKey: "id",
        foreignKey: "role",
      });

      models.Roles.hasMany(models.Users, {
        as: "userRoles",
        sourceKey: "id",
        foreignKey: "role",
      });
    }
  }
  Roles.init(
    {
      roleName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Roles",
    }
  );
  return Roles;
};
