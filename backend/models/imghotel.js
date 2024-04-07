'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImgHotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImgHotel.belongsTo(models.Hotel, { foreignKey: 'MaKhachSan', as : 'ImgHotels' ,as:'Hotel'})
    }
  }
  ImgHotel.init({
    tenHinh: DataTypes.STRING,
    duongDan: DataTypes.STRING,
    MaKhachSan: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ImgHotel',
  });
  return ImgHotel;
};