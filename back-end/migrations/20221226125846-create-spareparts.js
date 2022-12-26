'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spareparts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sparepart: {
        type: Sequelize.STRING
      },
      namaBarang: {
        type: Sequelize.STRING
      },
      merk: {
        type: Sequelize.STRING
      },
      spesifikasi: {
        type: Sequelize.STRING
      },
      kategori: {
        type: Sequelize.STRING
      },
      stok: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spareparts');
  }
};