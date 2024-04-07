'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BookingRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BookingRoom.hasMany(models.Payment, { foreignKey: 'maThanhToan' });
      BookingRoom.hasMany(models.Payment, { foreignKey: 'maThanhToan' });

      BookingRoom.hasMany(models.DetailBookingRoom, { foreignKey: 'maDatPhong', as: 'DetailBookingRoom'})
    }
  }
  BookingRoom.init({
    MaKhachHang: DataTypes.INTEGER,
    tenKhachHang: DataTypes.STRING,
    emailKhachHang: DataTypes.STRING,
    SDTKhachHang: DataTypes.STRING,
    tongTien: DataTypes.STRING,
    ngayDatPhong: DataTypes.STRING,
    ngayBatDau: DataTypes.STRING,
    ngayKetThuc: DataTypes.STRING,
    trangThaiThanhToan: DataTypes.STRING,
    soLuongKhach: DataTypes.INTEGER,
    soNgayThue: DataTypes.INTEGER,
    maHoaDon : DataTypes.INTEGER,
    trangThaiPhong:  {
      type: DataTypes.ENUM('Phòng trống','Chờ xác nhận', 'Đã đặt phòng', 'Đã Check-in','Đã Check-out','Đã hủy'),
      defaultValue: 'Đã đặt phòng'
    },
  }, {
    sequelize,
    modelName: 'BookingRoom', 
  });
  return BookingRoom;
};