'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Payment.belongsTo(models.BookingRoom, { foreignKey: 'maDatPhong' })
    }
  }
  Payment.init({
    maThanhToan: DataTypes.INTEGER,
    maDatPhong: DataTypes.INTEGER,
    methodPayment: DataTypes.STRING,
    ngayThanhToan: DataTypes.STRING,
    tongTien: DataTypes.STRING,
    maGiaoDich: DataTypes.STRING,
    NDThanhToan: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Payment',
  });
  return Payment;
};