'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.BookingRoom, { foreignKey: 'id' });
      User.hasMany(models.Evaluate, { foreignKey: 'MaKhachHang' });
    }
  }
  User.init({
    HoVaTen: DataTypes.STRING,
    email: DataTypes.STRING,
    Sdt: DataTypes.STRING,
    Matkhau: DataTypes.STRING,
    DiaChi: DataTypes.STRING,
    ngaySinh: DataTypes.STRING,
    socialID : DataTypes.STRING,
    avtUrl : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};