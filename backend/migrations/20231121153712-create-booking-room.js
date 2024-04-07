'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BookingRooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      MaKhachHang: { // Sửa trường này để tham chiếu đến email trong bảng Users
        type: Sequelize.INTEGER, // Thay đổi kiểu dữ liệu
        allowNull: false,
        references: {
          model: 'Users', // Tên bảng Users
          key: 'id'    // Trường email trong bảng Users
        }
      },
      tenKhachHang: {
        type: Sequelize.STRING
      },
      emailKhachHang: {
        type: Sequelize.STRING
      },
      SDTKhachHang: {
        type: Sequelize.STRING
      },
      tongTien: {
        type: Sequelize.STRING
      },
      ngayDatPhong: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      ngayBatDau: {
        type: Sequelize.STRING
      },
      ngayKetThuc: {
        type: Sequelize.STRING
      },
      trangThaiThanhToan: {
        type: Sequelize.STRING
      },
      soLuongKhach: {
        type: Sequelize.INTEGER
      },
      soNgayThue: {
        type: Sequelize.INTEGER
      },
      maHoaDon: {
        type: Sequelize.INTEGER
      },
      trangThaiPhong: {
        type: Sequelize.ENUM('Phòng trống','Chờ xác nhận', 'Đã đặt phòng', 'Đã Check-in','Đã Check-out','Đã hủy'),
        defaultValue: 'Đã đặt phòng'
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
    await queryInterface.dropTable('BookingRooms');
  }
};