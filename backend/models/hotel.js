'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hotel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Hotel.hasMany(models.ImgHotel, { foreignKey: 'MaKhachSan' , as: 'ImgHotel'});
      Hotel.hasMany(models.Like, { foreignKey: 'maKhachSan' });
      Hotel.hasMany(models.CategoryRoom, { foreignKey: 'MaKhachSan', as : 'CategoryRoom' });
      Hotel.hasMany(models.Evaluate, { foreignKey: 'maKhachSan', as : 'Evaluate' });

      Hotel.belongsTo(models.Province, { foreignKey: 'MaTinh' })
    }
  }
  Hotel.init({
    MaTinh: DataTypes.INTEGER,
    tenTinh: DataTypes.STRING,
    tenKhachSan: DataTypes.STRING,
    dienThoai: DataTypes.STRING,
    diaChi: DataTypes.STRING,
    tienIch: DataTypes.STRING,
    kinhdo : DataTypes.STRING,
    vido : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Hotel',
  });
  return Hotel;
};