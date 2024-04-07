const db = require('../models');
const CategoryRoom = db.CategoryRoom;
const BookingRoom = db.BookingRoom;
const DetailBookingRoom = db.DetailBookingRoom;
const User = db.User;
const Hotel = db.Hotel;
const Evaluate = db.Evaluate;
const sequelize = require('sequelize');
const { Op } = require('sequelize');

// Xác thực bình luận bằng mã hóa đơn
const Verifycomments = async (req, res) => {
    try {
        const {
            maHoaDon,
            maKhachSan
        } = req.body;
        console.log('ma hoa don ' + maHoaDon);

        // Kiểm tra thông tin đặt phòng
        const bookingRoom = await BookingRoom.findOne({
            where: {
                maHoaDon: maHoaDon,
                trangThaiPhong: {
                    [Op.notIn]: ['Chờ xác nhận', 'Đã hủy', 'Đã đặt phòng']
                }
            }
        });
        if (!bookingRoom) {
            return res.status(404).json({
                message: 'Mã hóa đơn không tồn tại hoặc không hợp lệ'
            });
        }

        // Kiểm tra thông tin phòng
        const detailRoom = await DetailBookingRoom.findOne({
            where: {
                maHoaDon: maHoaDon
            },
            include: [{
                model: CategoryRoom,
                as: 'room',
                include: [{
                    model: Hotel,
                    as: 'Hotel'
                }]
            }]
        });

        if (!detailRoom || !detailRoom.room || !detailRoom.room.Hotel) {
            return res.status(404).json({
                message: 'Không tìm thấy thông tin phòng với mã hóa đơn này'
            });
        }

        // Kiểm tra mã khách sạn từ request với mã khách sạn từ dữ liệu đặt phòng
        if (detailRoom.room.Hotel.id !== parseInt(maKhachSan)) {
            return res.status(400).json({
                message: 'Mã khách sạn không khớp'
            });
        }

        // Trả về thông báo xác nhận hợp lệ
        res.status(200).json({
            message: 'Xác nhận hợp lệ, mã hóa đơn và mã khách sạn khớp',
            maKhachSan: detailRoom.room.Hotel.id,
            tenKhachSan: detailRoom.room.Hotel.tenKhachSan,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
};



const AddcommentHotels = async (req, res) => {
    try {
        const {
            maHoaDonXacThuc,
            noiDung,
            sosao
        } = req.body;
        // Tìm tất cả các loại phòng có cùng mã hóa đơn
        const detailRooms = await DetailBookingRoom.findOne({
            where: {
                maHoaDon: maHoaDonXacThuc
            },
            include: [{
                model: CategoryRoom,
                as: 'room',
                include: [{
                    model: Hotel,
                    as: 'Hotel'
                }]
            }]
        });
        const bookingRoom = await BookingRoom.findOne({
            where: {
                maHoaDon: maHoaDonXacThuc
            },
        });
        if (detailRooms.room.Hotel.id && bookingRoom.MaKhachHang) {
            await Evaluate.create({
                MaKhachHang: bookingRoom.MaKhachHang,
                noiDung,
                sosao,
                maKhachSan: detailRooms.room.Hotel.id,
            })
        }
        return res.status(200).json({
            message: 'Thêm thành công',
            tenKH: bookingRoom.tenKhachHang,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Lỗi server',
        });
    }
};
const GetcommentHotels = async (req, res) => {
    try {
        const id = req.params.id; // Lấy id từ URL

        // Tìm sản phẩm dựa trên đường dẫn sản phẩm
        const hotels = await Hotel.findOne({
            where: {
                id: id
            },
        });

        if (!hotels) {
            return res.status(404).json({
                message: 'Không tìm thấy khách sạn',
            });
        }

        const hotelsId = hotels.id;

        // Thực hiện truy vấn để lấy bình luận dựa trên hotelsId
        const cmt = await Evaluate.findAll({
            where: {
                maKhachSan: hotelsId
            }, // Sử dụng hotelsId để lọc bình luận
            include: [{
                    model: Hotel,
                    attributes: ['id', 'tenKhachSan'],
                },
                {
                    model: User,
                    attributes: ['id', 'HoVaTen'],
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
    Verifycomments,
    GetcommentHotels,
    AddcommentHotels,
};