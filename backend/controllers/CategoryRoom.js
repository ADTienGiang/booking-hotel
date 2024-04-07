const db = require('../models');
const Hotel = db.Hotel;
const CategoryRoom = db.CategoryRoom;
const Province = db.Province;
const ImgRoom = db.ImgRoom;
const Evaluate = db.Evaluate;

const DetailBookingRoom = db.DetailBookingRoom;
const sequelize = require('sequelize');
const {
  Op
} = require('sequelize');

const multer = require('multer');
const env = require('dotenv').config();

// chọn nơi kho lưu trữ hình ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục nơi bạn muốn lưu trữ tệp hình ảnh
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Đặt tên cho tệp hình ảnh dựa trên thời gian
  },
});
const upload = multer({
  storage: storage
});
// Lấy danh sách phòng
const getRooms = async (req, res) => {
  try {
    const room = await CategoryRoom.findAll({
      attributes: ['id', 'MaKhachSan', 'tenLoaiPhong',  'soNguoi', 'soGiuongDon', 'soGiuongDoi', 'trangThaiPhong', 'moTa', 'dienTich', 'gia', 'giamGia', 'giaDaGiam', 'soLuong'],
      include: [{
          model: ImgRoom,
          attributes: ['id', 'tenHinh'],
          as: 'images'
        },
        // Thêm phần này để include tỉnh thành
        {
          model: Hotel,
          attributes: ['id', 'tenKhachSan'],
          as: 'Hotel'
        }
      ],
    });

    const formattedRooms = room.map((room) => ({
      id: room.id,
      MaKhachSan: room.MaKhachSan,
      tenLoaiPhong: room.tenLoaiPhong,
      soNguoi: room.soNguoi,
      soGiuongDon: room.soGiuongDon,
      soGiuongDoi: room.soGiuongDoi,
      trangThaiPhong: room.trangThaiPhong,
      moTa: room.moTa,
      dienTich: room.dienTich,
      gia: room.gia,
      giamGia: room.giamGia,
      giaDaGiam: room.giaDaGiam,
      soLuong: room.soLuong,
      images: room.images.map((image) => ({
        id: image.id,
        duongDan: image.tenHinh,
      })),
      // Lấy thông tin tỉnh thành
      Hotel: room.Hotel ? {
        id: room.Hotel.id,
        tenKhachSan: room.Hotel.tenKhachSan
      } : null,
    }));

    res.json(formattedRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Lỗi server',
      error: err,
    });
  }
};

// Thêm một phòng mới
const addRooms = async (req, res) => {
  try {
    upload.array('tenHinh', 20)(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: 'Lỗi tải lên hình ảnh'
        });
      }
      const {
        MaKhachSan,
        tenLoaiPhong,
        soNguoi,
        soGiuongDon,
        soGiuongDoi,
        trangThaiPhong,
        moTa,
        dienTich,
        gia,
        giamGia,
        giaDaGiam,
        soLuong,
      } = req.body;
      console.log(req.body);
      const existingRoom = await CategoryRoom.findOne({
        where: {
          MaKhachSan: MaKhachSan,
          tenLoaiPhong: tenLoaiPhong,
        }
      });

      if (existingRoom) {
        return res.status(400).json({
          message: 'Loại phòng này đã tồn tại cho khách sạn này'
        });
      }
      const rooms = await CategoryRoom.create({
        MaKhachSan,
        tenLoaiPhong,
        soNguoi,
        soGiuongDon,
        soGiuongDoi,
        trangThaiPhong,
        moTa,
        dienTich,
        gia,
        giamGia,
        giaDaGiam,
        soLuong,
      });
      console.log(rooms.id)
      const imgPromises = req.files.map(async (file) => {
        await ImgRoom.create({
          tenHinh: `${req.protocol}://${req.get('host')}/${file.filename}`,
          maLoaiPhong: rooms.id,
        });
      });
      // Đợi tất cả các hình ảnh banner được thêm vào
      await Promise.all(imgPromises);

      return res.status(201).json({
        message: 'Thêm room thành công'
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Thêm banner thất bại'
    });
  }
};
// Cập nhật phòng
const updateRooms = async (req, res) => {
  try {
    upload.array('tenHinh', 20)(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: 'Lỗi tải lên hình ảnh'
        });
      }

      const {
        MaKhachSan,
        tenLoaiPhong,
        soNguoi,
        soGiuongDon,
        soGiuongDoi,
        trangThaiPhong,
        moTa,
        dienTich,
        gia,
        giamGia,
        giaDaGiam,
        soLuong,
      } = req.body;

      // Update Hotel information
      // Update Hotel information
      await CategoryRoom.update({
        MaKhachSan,
        tenLoaiPhong,
        soNguoi,
        soGiuongDon,
        soGiuongDoi,
        trangThaiPhong,
        moTa,
        dienTich,
        gia,
        giamGia,
        giaDaGiam,
        soLuong,
      }, {
        where: {
          id: req.params.id // Giả sử bạn muốn cập nhật dựa trên ID được truyền qua URL
        }
      });
      // Update or create Images
      const imgPromises = req.files.map(async (file) => {
        const existingImage = await ImgRoom.findOne({
          where: {
            maLoaiPhong: req.params.id,
            tenHinh: `${req.protocol}://${req.get('host')}/${file.filename}`,
          },
        });
        if (!existingImage) {
          await ImgRoom.create({
            maLoaiPhong: req.params.id,
            tenHinh: `${req.protocol}://${req.get('host')}/${file.filename}`,
          });
        }
      });

      // Wait for all image updates/creations to complete
      await Promise.all(imgPromises);

      res.status(201).json({
        message: "Cập nhật sản phẩm thành công",
      });
    });
  } catch (error) {
    return res.status(401).json({
      message: "Cập nhật thất bại" + error,
    });
  }
};
// Xóa phòng
const deleteRooms = async (req, res) => {
  const RoomId = req.params.id;
  try {
    const Rooms = await CategoryRoom.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!Rooms) {
      return res.status(404).json({
        message: "Không tìm thấy phòng"
      });
    }
    const detailOrderRoom = await DetailBookingRoom.findAll({
      where: {
        maLoaiPhong: RoomId
      }
    });
    if (detailOrderRoom.length > 0) {
      return res.status(400).json({
        message: "Phòng này đã tồn tại hóa đơn, không thể xóa"
      });
    }

    const hotelImages = await ImgRoom.findAll({
      where: {
        maLoaiPhong: req.params.id
      }
    });
    for (const image of hotelImages) {
      await image.destroy();
    }
    await Rooms.destroy();
    res.status(200).json({
      message: "Xóa phòng và hình ảnh thành công"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Lỗi trong quá trình xóa khách sạn, hình ảnh và các bản ghi liên quan"
    });
  }
}

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id; // Lấy imageId từ tham số URL

    // Tìm hình ảnh cần xóa dựa trên imageId
    const image = await ImgRoom.findOne({
      where: {
        id: imageId
      }
    });

    // Kiểm tra xem hình ảnh có tồn tại không
    if (!image) {
      return res.status(404).json({
        message: 'Hình ảnh không tồn tại'
      });
    }
    // Xóa hình ảnh khỏi cơ sở dữ liệu
    await image.destroy();

    res.status(200).json({
      message: 'Đã xóa hình ảnh'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi xóa hình ảnh'
    });
  }
};
const GetRoomByFilter = async (req, res) => {
  try {
    const province = req.query.province;
    const checkInDate = req.query.checkInDate;
    const checkOutDate = req.query.checkOutDate;
    const numberOfGuests = parseInt(req.query.numberOfGuests, 10);
    const numberOfRoom = parseInt(req.query.numberOfRoom, 10);
    const groupChild = parseInt(req.query.groupChild);
    const tongNguoi = numberOfGuests + groupChild;
    if (!province || !checkInDate || !checkOutDate || numberOfGuests == null || numberOfRoom == null || groupChild == null) {
      return res.status(400).json({
        message: "Missing required parameters",
      });
    }
    // Tính số ngày thuê
    function convertDateString(dateStr) {
      return dateStr.replace(' sa', '').replace(' ch', '').replace(' ', 'T') + ':00';
    }

    // Tính số ngày thuê
    const inDate = new Date(convertDateString(checkInDate));
    const outDate = new Date(convertDateString(checkOutDate));
    const rentalDays = Math.round((outDate.getTime() - inDate.getTime()) / (1000 * 3600 * 24));
    console.log(rentalDays)
    const hotelsInProvince = await Hotel.findAll({
      where: {
        tenTinh: province,
      },
      include: [{
        model: CategoryRoom,
        attributes: ['id', 'tenLoaiPhong',  'soNguoi', 'soGiuongDon', 'soGiuongDoi', 'trangThaiPhong', 'moTa', 'dienTich', 'gia', 'giamGia', 'giaDaGiam', 'soLuong'],
        as: 'CategoryRoom',
        include: [{
          model: ImgRoom,
          attributes: ['id', 'tenHinh'],
          as: 'images'
        }, ],
      },
      {
        model: Evaluate,
        attributes: ['id', 'MaKhachHang', 'noiDung', 'sosao', 'maKhachSan'], // Include the attributes you need from the Evaluate model
        as: 'Evaluate', 
      } ],
    });
    const filteredRooms = hotelsInProvince.map(hotel => {
      let availableRooms = hotel.CategoryRoom.filter(room => room.trangThaiPhong !== 'Sửa chữa');
      let sapXepPhongRe = availableRooms.map(r => r.get({ plain: true })).sort((a, b) => a.gia - b.gia);
      // let sapXepPhongRe = availableRooms.map(r => r.get({ plain: true })).sort((a, b) => b.gia - a.gia);

      let sapXepPhongTheoSucChua = availableRooms.map(r => r.get({ plain: true }))
      .sort((a, b) => (b.soGiuongDon + b.soGiuongDoi * 2) - (a.soGiuongDon + a.soGiuongDoi * 2));
      let selectedRooms = [];
      let guestsRemaining = tongNguoi;
      let totalRoomPrice = 0;
      let totalDiscountedPrice = 0;
      let roomsToAllocate = numberOfRoom;
      const averageRating = calculateAverageRatingForHotel(hotel.Evaluate);
      const numberOfReviews = hotel.Evaluate.length; // Số lượng đánh giá

      for (const room of sapXepPhongTheoSucChua) {
          let roomCapacity = room.soGiuongDon + room.soGiuongDoi * 2;
          let roomsAvailable = room.soLuong;
          let roomsNeeded = Math.ceil(guestsRemaining / roomCapacity);
  
          // Điều chỉnh roomsNeeded để không vượt quá số lượng phòng khách yêu cầu
          roomsNeeded = roomsNeeded > roomsToAllocate ? roomsToAllocate : roomsNeeded;
  
          if (roomsNeeded > 0 && roomsAvailable >= roomsNeeded) {
              let roomPrice = room.gia * roomsNeeded * rentalDays;
              let roomDiscountedPrice = room.giaDaGiam * roomsNeeded * rentalDays;
              totalRoomPrice += roomPrice;
              totalDiscountedPrice += roomDiscountedPrice;
              selectedRooms.push({ ...room, roomsNeeded, roomPrice, roomDiscountedPrice });
              guestsRemaining -= roomCapacity * roomsNeeded;
              roomsToAllocate -= roomsNeeded;
          }
  
          // Nếu cần thêm phòng, tăng số lượng phòng cần thiết
          if (guestsRemaining > 0 && roomsToAllocate <= 0) {
              roomsToAllocate = Math.max(roomsToAllocate, Math.ceil(guestsRemaining / roomCapacity));
          }
  
          if (roomsToAllocate <= 0) break;
      }
  
      if (selectedRooms.length > 0 && guestsRemaining <= 0) {
          return {
              hotelId: hotel.id,
              hotelName: hotel.tenKhachSan,
              diaChi: hotel.diaChi,
              kinhdo: hotel.kinhdo,
              vido: hotel.vido,
              phongkhachYeuCau: numberOfRoom,
              totalPrice: totalRoomPrice,
              discoutedRice: totalDiscountedPrice,
              suitableRooms: selectedRooms,
              soDem : rentalDays,
              nguoiLon : numberOfGuests,
              treEm : groupChild,
              averageRating: averageRating.toFixed(1), // Làm tròn đến 1 chữ số thập phân
              numberOfReviews: numberOfReviews, // Số lượng đánh giá

            };
      } else {
          return null; // Không tìm thấy phòng phù hợp
      }
  }).filter(hotel => hotel !== null);
  
  res.json(filteredRooms);
  function calculateAverageRatingForHotel(evaluations) {
    if (!evaluations || evaluations.length === 0) return 0;
    const totalStars = evaluations.reduce((sum, review) => sum + review.sosao, 0);
    return (totalStars / evaluations.length) * 2; // Chuyển sang thang điểm 10
  }

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Lỗi server',
      error: err,
    });
  }
};
// const GetRoomByFilter = async (req, res) => {
//   try {
//     // ... phần còn lại của mã không đổi ...

//     const hotelsInProvince = await Hotel.findAll({
//       // ... phần truy vấn không đổi ...
//     });

//     const filteredRooms = hotelsInProvince.map(hotel => {
//       // Tính số người trung bình mỗi phòng cần chứa
//       const avgNguoiPerRoom = Math.ceil(tongNguoi / numberOfRoom);

//       // Lọc ra các phòng phù hợp
//       const suitableRooms = hotel.CategoryRoom.map(r => r.get({ plain: true }))
//         .filter(room => {
//           const roomCapacity = room.soGiuongDon + room.soGiuongDoi * 2;
//           return roomCapacity >= avgNguoiPerRoom && room.soLuong >= numberOfRoom;
//         });

//       const mostSuitableRoom = suitableRooms.length > 0 ? suitableRooms[0] : null;

//       if (mostSuitableRoom) {
//         return {
//           hotelId: hotel.id,
//           hotelName: hotel.tenKhachSan,
//           kinhdo: hotel.kinhdo,
//           vido: hotel.vido,
//           soPhongCanThiet: numberOfRoom, // Số lượng phòng cần thiết là số lượng phòng đã yêu cầu
//           room: { ...mostSuitableRoom }
//         };
//       } else {
//         return null;
//       }
//     }).filter(hotel => hotel !== null);

//     res.json(filteredRooms);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       message: 'Lỗi server',
//       error: err,
//     });
//   }
// };

module.exports = {
  getRooms,
  addRooms,
  deleteRooms,
  updateRooms,
  GetRoomByFilter,
  deleteImage
};