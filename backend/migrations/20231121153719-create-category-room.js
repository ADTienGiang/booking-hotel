'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CategoryRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MaKhachSan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Hotels',
          key: 'id'
        }
      },
      tenLoaiPhong: {
        type: Sequelize.STRING
      },
      soNguoi: {
        type: Sequelize.INTEGER
      },
      soGiuongDon: {
        type: Sequelize.INTEGER
      },
      soGiuongDoi: {
        type: Sequelize.INTEGER
      },
      trangThaiPhong: {
        type: Sequelize.ENUM('Phòng trống', 'Sửa chữa'),
        defaultValue: 'Phòng trống'
      },
      moTa: {
        type: Sequelize.STRING
      },
      giamGia: {
        type: Sequelize.STRING
      },
      giaDaGiam: {
        type: Sequelize.STRING
      },
      dienTich: {
        type: Sequelize.STRING
      },
     
  
      gia: {
        type: Sequelize.INTEGER
      },
      soLuong: {
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
    await queryInterface.dropTable('CategoryRooms');
  }
};