const db = require('../models');
const Hotel = db.Hotel;
const CategoryRoom = db.CategoryRoom;
const Province = db.Province;
const ImgRoom = db.ImgRoom;
// Thêm một khách sạn mới
const filterRoomResults = async (req, res) => {
  try {
  
  } catch (error) {
    return res.status(500).json({
      message: 'Tìm kiếm thất bại'
    });
  }
};
const GetRoomByFilter = async (req, res) => {
    try {
    
    } catch (error) {
      return res.status(500).json({
        message: 'Lấy danh sách loại phòng thất bại'
      });
    }
  };
module.exports = {
  filterRoomResults,
  GetRoomByFilter,
};