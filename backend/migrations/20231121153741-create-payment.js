'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
  
      maDatPhong: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BookingRooms',
          key: 'id'
        }
      },
      methodPayment: {
        type: Sequelize.STRING
      },
      ngayThanhToan: {
        type: Sequelize.STRING
      },
      tongTien: {
        type: Sequelize.STRING
      },
      maGiaoDich: {
        type: Sequelize.STRING
      },
      NDThanhToan: {
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
    await queryInterface.dropTable('Payments');
  }
};