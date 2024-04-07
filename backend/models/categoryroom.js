'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CategoryRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CategoryRoom.belongsTo(models.Hotel, { foreignKey: 'MaKhachSan' ,as : 'Hotel' })
      //CategoryRoom.belongsTo(models.BookingRoom, { foreignKey: 'maDatPhong' })
      CategoryRoom.hasMany(models.ImgRoom, { foreignKey: 'maLoaiPhong' , as : 'images'});

      
    }
  }
  CategoryRoom.init({
    MaKhachSan: DataTypes.INTEGER,
    tenLoaiPhong: DataTypes.STRING,
    soNguoi: DataTypes.INTEGER,
    soGiuongDon: DataTypes.INTEGER,
    soGiuongDoi: DataTypes.INTEGER,
    trangThaiPhong:  {
      type: DataTypes.ENUM('Phòng trống', 'Sửa chữa'),
      defaultValue: 'Phòng trống'
    },
    moTa: DataTypes.STRING,
    giamGia: DataTypes.STRING,
    giaDaGiam: DataTypes.STRING,
    dienTich: DataTypes.STRING,
    gia: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CategoryRoom',
  });
  return CategoryRoom;
};