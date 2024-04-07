'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailBookingRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      maLoaiPhong: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CategoryRooms',
          key: 'id'
        }
      },
      maDatPhong: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'BookingRooms',
          key: 'id'
        }
      },
      maHoaDon: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      SoLuongPhong: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      statusMail: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable('DetailBookingRooms');
  }
};