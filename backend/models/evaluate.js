'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evaluate.belongsTo(models.User, { foreignKey: 'MaKhachHang' })
      Evaluate.belongsTo(models.Hotel, { foreignKey: 'maKhachSan' })

    }
  }
  Evaluate.init({
    MaKhachHang: DataTypes.INTEGER,
    noiDung: DataTypes.TEXT,
    sosao: DataTypes.INTEGER,
    maKhachSan: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Evaluate',
  });
  return Evaluate;
};