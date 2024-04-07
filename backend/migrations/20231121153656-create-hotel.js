'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Hotels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
  
      MaTinh: {
        type: Sequelize.INTEGER
      },
      tenTinh: {
        type: Sequelize.STRING
      },
      tenKhachSan: {
        type: Sequelize.STRING
      },
      dienThoai: {
        type: Sequelize.STRING
      },
      diaChi: {
        type: Sequelize.STRING
      },
      tienIch: {
        type: Sequelize.STRING
      },
      kinhdo: {
        type: Sequelize.STRING
      },  
      vido: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Hotels');
  }
};