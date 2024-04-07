const db = require('../models');
const Hotel = db.Hotel;
const Province = db.Province;
const ImgHotel = db.ImgHotel;
const ImgRoom = db.ImgRoom;
const CategoryRoom = db.CategoryRoom;
const Evaluate = db.Evaluate;

const sequelize = require('sequelize');
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

// Lấy danh sách khách sạn
const getHotel = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      attributes: ['id', 'MaTinh', 'tenKhachSan', 'dienThoai', 'diaChi', 'tienIch', 'kinhdo', 'vido'],
      include: [{
          model: ImgHotel,
          attributes: ['id', 'duongDan'],
          as: 'ImgHotel',
        },
        // Thêm phần này để include tỉnh thành
        {
          model: Province,
          attributes: ['id', 'tenTinhThanh']
        }
      ],
    });

    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      maKhachSan: hotel.maKhachSan,
      MaTinh: hotel.MaTinh,
      tenKhachSan: hotel.tenKhachSan,
      dienThoai: hotel.dienThoai,
      diaChi: hotel.diaChi,
      tienIch: hotel.tienIch,
      kinhdo: hotel.kinhdo,
      vido: hotel.vido,
      images: hotel.ImgHotel.map((image) => ({
        id: image.id,
        duongDan: image.duongDan
      })),
      // Lấy thông tin tỉnh thành
      tinhThanh: hotel.Province ? {
        id: hotel.Province.id,
        tenTinhThanh: hotel.Province.tenTinhThanh
      } : null,
    }));

    res.json(formattedHotels);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Lỗi server',
      error: err,
    });
  }
};
// Thêm một khách sạn mới
const addHotel = async (req, res) => {
  try {
    upload.array('tenHinh', 20)(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: 'Lỗi tải lên hình ảnh'
        });
      }
      const {
        MaTinh,
        tenTinh,
        tenKhachSan,
        dienThoai,
        tienIch,
        diaChi,
        kinhDo,
        viDo
      } = req.body;

      // Kiểm tra xem đã tồn tại khách sạn với cùng kinh độ và vĩ độ hay chưa
      const existingHotel = await Hotel.findOne({
        where: {
          kinhdo: kinhDo,
          vido: viDo
        }
      });

      if (existingHotel) {
        return res.status(400).json({
          message: 'Khách sạn với kinh độ và vĩ độ đã tồn tại',
          errorCode: 'DUPLICATE_HOTEL'
        });
      }

      // Nếu không trùng, tiến hành tạo khách sạn
      const product = await Hotel.create({
        MaTinh,
        tenTinh,
        tenKhachSan,
        dienThoai,
        tienIch,
        diaChi,
        kinhdo: kinhDo,
        vido: viDo,
      });

      const imgPromises = req.files.map(async (file) => {
        await ImgHotel.create({
          tenHinh: file.path,
          duongDan: `${req.protocol}://${req.get('host')}/${file.filename}`,
          MaKhachSan: product.id,
        });
      });

      // Đợi tất cả các hình ảnh banner được thêm vào
      await Promise.all(imgPromises);

      return res.status(201).json({
        message: 'Thêm khách sạn thành công'
      });
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Thêm khách sạn thất bại'
    });
  }
};

// Cập nhật khách sạn
const updateHotel = async (req, res) => {
  try {
    upload.array('tenHinh', 20)(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          message: 'Lỗi tải lên hình ảnh'
        });
      }

      const {
        MaTinh,
        tenTinh,
        tenKhachSan,
        dienThoai,
        tienIch,
        diaChi,
        kinhDo,
        viDo
      } = req.body;

      // Update Hotel information
      // Update Hotel information
      await Hotel.update({
        MaTinh,
        tenTinh,
        tenKhachSan,
        dienThoai,
        tienIch,
        diaChi,
        kinhdo: kinhDo,
        vido: viDo,
      }, {
        where: {
          id: req.params.id,
        },
      });



      // Update or create Images
      const imgPromises = req.files.map(async (file) => {
        const existingImage = await ImgHotel.findOne({
          where: {
            MaKhachSan: req.params.id,
            tenHinh: file.path,
          },
        });

        if (!existingImage) {
          await ImgHotel.create({
            MaKhachSan: req.params.id,
            tenHinh: file.path,
            duongDan: `${req.protocol}://${req.get('host')}/${file.filename}`,
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
// Xóa khách sạn
const deleteHotel = async (req, res) => {
  const hotelId = req.params.id;
  try {
    const roominHotel = await CategoryRoom.findAll({
      where: {
        MaKhachSan: hotelId
      }
    });
    if (roominHotel.length > 0) {
      return res.status(400).json({
        message: "Khách sạn đã tồn tại phòng, không thể xóa"
      });
    }
    const hotelImages = await ImgHotel.findAll({
      where: {
        MaKhachSan: req.params.id
      }
    });
    for (const image of hotelImages) {
      await image.destroy();
    }
    await Hotel.destroy({
      where: {
        id: hotelId
      }
    });
    res.status(200).json({
      message: "Xóa khách sạn thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Lỗi khi xóa khách sạn"
    });
  }
}
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id; // Lấy imageId từ tham số URL

    // Tìm hình ảnh cần xóa dựa trên imageId
    const image = await ImgHotel.findOne({
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
const GetDataDetailRoom = async (req, res) => {
  try {
    const kinhDo = parseFloat(req.query.KinhDo);
    const viDo = parseFloat(req.query.viDo);

    // Thực hiện truy vấn cơ sở dữ liệu dựa trên kinh độ và vĩ độ
    const detailData = await Hotel.findAll({
      where: {
        kinhDo: {
          [sequelize.Op.between]: [kinhDo - 0.01, kinhDo + 0.01],
        },
        viDo: {
          [sequelize.Op.between]: [viDo - 0.01, viDo + 0.01],
        },
      },
      attributes: ['id', 'tenTinh', 'tenKhachSan', 'dienThoai', 'diaChi', 'tienIch', 'kinhDo', 'viDo'],
      include: [{
        model: CategoryRoom,
        attributes: ['id', 'tenLoaiPhong', 'moTa', 'soNguoi', 'gia', 'giamGia', 'giaDaGiam', 'soLuong'],
        as: 'CategoryRoom',
        where: {
          trangThaiPhong: {
            [sequelize.Op.not]: 'Sửa chữa' // Loại bỏ loại phòng "Sửa chữa"
          },
        },
        include: [{
          model: ImgRoom,
          attributes: ['id', 'tenHinh'],
          as: 'images'
        }],
      }, {
        model: ImgHotel,
        attributes: ['id', 'duongDan'],
        as: 'ImgHotel',
      }],
    });

    res.status(200).json(detailData);
  } catch (error) {
    res.status(500).json({
      message: 'Lỗi khi lấy chi tiết khách sạn',
      error: error,
    });
  }
};


const AddcommentHotels = async (req, res) => {
  try {
      // Lấy thông tin từ request body hoặc từ middleware, phụ thuộc vào cách bạn đã cấu hình route.
      const {
          maLoaiPhong,
          MaKhachHang,
          noiDung,
          sosao
      } = req.body;

      // Tạo một bản ghi mới trong bảng Evaluate
      const newComment = await Evaluate.create({
          maLoaiPhong,
          MaKhachHang,
          noiDung,
          sosao,
      });

      if (newComment) {
          return res.status(201).json({
              message: 'Thêm đánh giá thành công',
              data: newComment,
          });
      } else {
          return res.status(400).json({
              message: 'Thêm đánh giá thất bại',
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: 'Lỗi server',
      });
  }
};
const GetcommentHotels = async (req, res) => {
  try {
      const duong_dan_san_pham = req.params.duong_dan_san_pham; // Lấy duong_dan_san_pham từ URL

      // Tìm sản phẩm dựa trên đường dẫn sản phẩm
      const product = await Product.findOne({
          where: {
              duong_dan_san_pham: duong_dan_san_pham
          },
          attributes: ['id'],
      });

      if (!product) {
          return res.status(404).json({
              message: 'Không tìm thấy sản phẩm',
          });
      }

      const productId = product.id;

      // Thực hiện truy vấn để lấy bình luận dựa trên productId
      const cmt = await Evaluate.findAll({
          where: {
              maLoaiPhong: productId
          }, // Sử dụng productId để lọc bình luận
          include: [{
                  model: Product,
                  attributes: ['id', 'name'],
              },
              {
                  model: Users,
                  attributes: ['id', 'username'],
              },
          ],
      });

      res.json(cmt);
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: 'Lỗi server',
      });
  }
};
module.exports = {
  getHotel,
  addHotel,
  deleteHotel,
  updateHotel,
  deleteImage,
  GetDataDetailRoom,
  AddcommentHotels,
  GetcommentHotels
};