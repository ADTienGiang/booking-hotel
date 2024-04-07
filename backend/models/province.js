'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Province.hasMany(models.Hotel, { foreignKey: 'MaTinh',as : 'Hotel' });
    }
  }
  Province.init({
    code : DataTypes.INTEGER,
    tenTinhThanh: DataTypes.STRING,
    hinhAnh: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Province',
  });
  return Province;
};