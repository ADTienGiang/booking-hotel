'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.Hotel, { foreignKey: 'maKhachSan' ,as: 'hotels'})
      Like.belongsTo(models.User, { foreignKey: 'maKhachHang' })
    }
  }
  Like.init({
    maKhachHang: DataTypes.INTEGER,
    maKhachSan: DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,
    status_seen:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};