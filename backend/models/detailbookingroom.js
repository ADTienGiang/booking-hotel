'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailBookingRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      DetailBookingRoom.belongsTo(models.BookingRoom, { foreignKey: 'maDatPhong',  as: 'booking' })
      DetailBookingRoom.belongsTo(models.CategoryRoom, { foreignKey: 'maLoaiPhong' , as: 'room'})
    }
  }
  DetailBookingRoom.init({
    maLoaiPhong: DataTypes.INTEGER,
    maDatPhong: DataTypes.INTEGER,
    maHoaDon: DataTypes.INTEGER,
    SoLuongPhong: DataTypes.INTEGER,
    statusMail : DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'DetailBookingRoom',
  });
  return DetailBookingRoom;
};