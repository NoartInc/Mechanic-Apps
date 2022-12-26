"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TransaksiSpareparts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      noReferensi: {
        type: Sequelize.STRING,
      },
      supplier: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      type: {
        type: Sequelize.ENUM("in", "out"),
      },
      status: {
        type: Sequelize.ENUM("update", "adjust"),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TransaksiSpareparts");
  },
};
