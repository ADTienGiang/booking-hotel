'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImgRoom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImgRoom.belongsTo(models.CategoryRoom, { foreignKey: 'maLoaiPhong' })
    }
  }
  ImgRoom.init({
    maLoaiPhong: DataTypes.INTEGER,
    tenHinh: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ImgRoom',
  });
  return ImgRoom;
};