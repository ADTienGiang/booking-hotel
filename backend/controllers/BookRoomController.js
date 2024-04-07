const express = require('express');
const routerPayment = express.Router();
const $ = require('jquery');
const request = require('request');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const API_KEY_CHECK_MAIL = process.env.API_KEY_CHECK_MAIL;
const axios = require('axios');
const headers = {
    'apikey': API_KEY_CHECK_MAIL
};
const db = require('../models');
const BookingRoom = db.BookingRoom;
const CategoryRoom = db.CategoryRoom;
const DetailBookingRoom = db.DetailBookingRoom;
const ImgRoom = db.ImgRoom;
const Hotel = db.Hotel;
const ImgHotel = db.ImgHotel;
const User = db.User;
const Payment = db.Payment;
// const encodedEmail = encodeURIComponent(emailKhachHang);
// const url = `http://api.apilayer.com/email_verification/check?email=${encodedEmail}`;
// const response = await axios.get(url, {
//     headers
// });
// const emailVerificationResult = response.data;
// if (!emailVerificationResult.format_valid || !emailVerificationResult.mx_found || !emailVerificationResult.smtp_check) {
//     return res.status(400).json({
//         message: 'Email không tồn tại'
//     });
// }
routerPayment.post('/create_payment_url', async function (req, res, next) {
    try {
        const {
            tenKhachHang,
            emailKhachHang,
            SDTKhachHang,
            ngayBatDau,
            ngayKetThuc,
            soLuongKhach,
            soNgayThue,
            SoLuongPhong,
            idCategoryRoom
        } = req.body;

        console.log('id phong la : ' + idCategoryRoom);
        const soLuongArray = SoLuongPhong.map(item => item.soLuong);
        console.log('so luong phong' + soLuongArray);
        try {
            // Kiểm tra xem người dùng đã tồn tại chưa
            let user = await User.findOne({
                where: {
                    email: emailKhachHang
                }
            });
            // const encodedEmail = encodeURIComponent(emailKhachHang);
            // const url = `http://api.apilayer.com/email_verification/check?email=${encodedEmail}`;
            // const response = await axios.get(url, {
            //     headers
            // });
            // const emailVerificationResult = response.data;
            // if (!emailVerificationResult.format_valid || !emailVerificationResult.mx_found || !emailVerificationResult.smtp_check) {
            //     return res.status(400).json({
            //         message: 'Email không tồn tại'
            //     });
            // }
            let date = new Date();
            let orderId = moment(date).format('DDHHmmss');
            if (!user) {
                user = await User.create({
                    HoVaTen: tenKhachHang,
                    email: emailKhachHang,
                    Sdt: SDTKhachHang,
                });
            }
    
            const bookingRoom = await BookingRoom.create({
                MaKhachHang: user.id,
                tenKhachHang: user.HoVaTen,
                emailKhachHang: user.email,
                SDTKhachHang: user.Sdt,
                ngayBatDau,
                ngayKetThuc,
                soLuongKhach,
                soNgayThue,
                tongTien: req.body.amount,
                maHoaDon: orderId,
                trangThaiPhong: 'Chờ xác nhận',
            });
            const ngayHienTai = new Date();
            const ngayThanhToan = ngayHienTai.toISOString().split('T')[0];

            await Payment.create({
                maDatPhong: bookingRoom.id,
                methodPayment: 'VNPAY',
                ngayThanhToan: ngayThanhToan,
                tongTien: req.body.amount,
                maGiaoDich: orderId,
                NDThanhToan: 'thanh toan cho ma giao dich' + orderId,
            })
            for (let i = 0; i < idCategoryRoom.length; i++) {
                const categoryId = idCategoryRoom[i];
                const soLuongPhong = soLuongArray[i];

                await DetailBookingRoom.create({
                    maLoaiPhong: categoryId,
                    maDatPhong: bookingRoom.id,
                    SoLuongPhong: soLuongPhong,
                    maHoaDon: orderId,
                    statusMail: false
                });

                const categoryRoom = await CategoryRoom.findByPk(categoryId);
                if (categoryRoom) {
                    if (categoryRoom.soLuong >= soLuongPhong) {
                        categoryRoom.soLuong -= soLuongPhong;
                        await categoryRoom.save();
                    } 
                } 
            }

        } catch (error) {
            console.error('Lỗi khi thêm đặt phòng:', error);
            return res.status(500).json({
                message: 'Lỗi server'
            });
        }
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        let config = require('config');
        let tmnCode = config.get('vnp_TmnCode');
        let secretKey = config.get('vnp_HashSecret');
        let vnpUrl = config.get('vnp_Url');
        let returnUrl = config.get('vnp_ReturnUrl');
        let orderId = moment(date).format('DDHHmmss');
        let amount = req.body.amount;
        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount*100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, {
            encode: false
        });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, {
            encode: false
        });
        res.json({
            redirectUrl: vnpUrl,
        });
    } catch (error) {
        console.error('Lỗi khi thêm dữ liệu:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
routerPayment.post('/datTruocPhong', async function (req, res) {
    try {
        const {
            tenKhachHang,
            emailKhachHang,
            SDTKhachHang,
            ngayBatDau,
            ngayKetThuc,
            soLuongKhach,
            soNgayThue,
            SoLuongPhong,
            idCategoryRoom
        } = req.body;

        // Kiểm tra người dùng
        let user = await User.findOne({
            where: {
                email: emailKhachHang
            }
        });
        if (!user) {
            user = await User.create({
                HoVaTen: tenKhachHang,
                email: emailKhachHang,
                Sdt: SDTKhachHang,
            });
        }
        // const encodedEmail = encodeURIComponent(emailKhachHang);
        // const url = `http://api.apilayer.com/email_verification/check?email=${encodedEmail}`;
        // const response = await axios.get(url, {
        //     headers
        // });
        // const emailVerificationResult = response.data;
        // if (!emailVerificationResult.format_valid || !emailVerificationResult.mx_found || !emailVerificationResult.smtp_check) {
        //     return res.status(400).json({
        //         message: 'Email không tồn tại'
        //     });
        // }
        // Tạo mã hóa đơn
        let date = new Date();
        let orderId = moment(date).format('DDHHmmss');
        console.log(idCategoryRoom)
        // Kiểm tra số lượng phòng
        for (let i = 0; i < idCategoryRoom.length; i++) {
            if (!SoLuongPhong[i] || typeof SoLuongPhong[i].soLuong === 'undefined') {
                return res.status(400).json({
                    message: 'Dữ liệu số lượng phòng không hợp lệ hoặc không đầy đủ.'
                });
            }
            const categoryId = idCategoryRoom[i];
            const soLuongPhongYeuCau = SoLuongPhong[i].soLuong;
            const categoryRoom = await CategoryRoom.findByPk(categoryId);
            if (!categoryRoom || categoryRoom.soLuong < soLuongPhongYeuCau) {
                return res.status(400).json({
                    message: 'Không đủ số lượng phòng'
                });
            }
        }

        // Tạo đặt phòng
        const bookingRoom = await BookingRoom.create({
            MaKhachHang: user.id,
            tenKhachHang: user.HoVaTen,
            emailKhachHang: user.email,
            SDTKhachHang: user.Sdt,
            ngayBatDau,
            ngayKetThuc,
            soLuongKhach,
            soNgayThue,
            tongTien: req.body.amount,
            maHoaDon: orderId,
            trangThaiPhong: 'Chờ xác nhận',
            trangThaiThanhToan: 'Chưa thanh toán'
        });

        // Tạo chi tiết đặt phòng và cập nhật số lượng phòng
        let detailBookingRooms = [];
        for (let i = 0; i < idCategoryRoom.length; i++) {
            const categoryId = idCategoryRoom[i];
            const soLuongPhong = SoLuongPhong[i].soLuong;

            const detailBookingRoom = await DetailBookingRoom.create({
                maLoaiPhong: categoryId,
                maDatPhong: bookingRoom.id,
                SoLuongPhong: soLuongPhong,
                maHoaDon: orderId,
                statusMail: false
            });
            detailBookingRooms.push(detailBookingRoom.get({
                plain: true
            }));

            const categoryRoom = await CategoryRoom.findByPk(categoryId);
            categoryRoom.soLuong -= soLuongPhong;
            await categoryRoom.save();
        }

        return res.json({
            bookingRoom: bookingRoom.get({
                plain: true
            }),
            detailBookingRooms: detailBookingRooms
        });
    } catch (error) {
        console.error('Lỗi khi thêm đặt phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});

// lấy hóa đơn theo id 
routerPayment.get('/getDetailRoomBooking/:id', async (req, res) => {
    const maHoaDon = req.params.id;
    const vnp_TransactionStatus = req.query.vnp_TransactionStatus;
    try {
        const detailBookings = await DetailBookingRoom.findAll({
            where: {
                maHoaDon: maHoaDon
            },
            include: [{
                    model: BookingRoom,
                    as: 'booking',
                },
                {
                    model: CategoryRoom,
                    as: 'room',
                    include: [{
                            model: ImgRoom,
                            as: 'images',
                        },
                        {
                            model: Hotel,
                            as: 'Hotel',
                            include: [{
                                model: ImgHotel,
                                as: 'ImgHotel'
                            }]
                        }
                    ]
                }
            ]
        });
        let statusPayment = '';
        if (vnp_TransactionStatus === '00') {
            statusPayment = 'Đã thanh toán';
        } else if (vnp_TransactionStatus === '02') {
            statusPayment = 'Chưa thanh toán';
        } else {
            statusPayment = 'Chưa thanh toán';
        }
        await BookingRoom.update({
                trangThaiThanhToan: statusPayment
            }, // Sử dụng giá trị vnp_TransactionStatus ở đây
            {
                where: {
                    maHoaDon: maHoaDon
                }
            }
        );
        if (!detailBookings || detailBookings.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy chi tiết đặt phòng'
            });
        }
        // Gửi kết quả về client
        res.json({
            detailBookings: detailBookings,
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết đặt phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
// lấy hóa đơn đặt trước
routerPayment.get('/getDetailRoomBookingReserver/:id', async (req, res) => {
    const maHoaDon = req.params.id;
    try {
        const detailBookings = await DetailBookingRoom.findAll({
            where: {
                maHoaDon: maHoaDon
            },
            include: [{
                    model: BookingRoom,
                    as: 'booking',
                },
                {
                    model: CategoryRoom,
                    as: 'room',
                    include: [{
                            model: ImgRoom,
                            as: 'images',
                        },
                        {
                            model: Hotel,
                            as: 'Hotel',
                            include: [{
                                model: ImgHotel,
                                as: 'ImgHotel'
                            }]
                        }
                    ]
                }
            ]
        });
        if (!detailBookings || detailBookings.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy chi tiết đặt phòng'
            });
        }
        // Gửi kết quả về client
        res.json({
            detailBookings: detailBookings,
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin chi tiết đặt phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
routerPayment.get('/getAllRoomBookings', async (req, res) => {
    try {
        // Truy vấn tất cả thông tin từ bảng detailBookingRoom
        const allDetailBookings = await DetailBookingRoom.findAll({
            include: [{
                    model: BookingRoom,
                    as: 'booking', // Bí danh của mối quan hệ
                },
                {
                    model: CategoryRoom,
                    as: 'room',
                    include: [{
                            model: ImgRoom, // Mối quan hệ giữa CategoryRoom và ImgRoom
                            as: 'images',
                        },
                        {
                            model: Hotel, // Mối quan hệ giữa CategoryRoom và Hotel
                            as: 'Hotel',
                            include: [{
                                model: ImgHotel,
                                as: 'ImgHotel'
                            }]
                        }
                    ]
                }
            ]
        });

        if (!allDetailBookings || allDetailBookings.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy chi tiết đặt phòng'
            });
        }
        // Gửi kết quả về client
        res.json({
            allDetailBookings: allDetailBookings,
        });
    } catch (error) {
        console.error('Lỗi khi lấy tất cả thông tin chi tiết đặt phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
routerPayment.put('/updateRoomStatus/:id', async (req, res) => {
    const maHoaDon = req.params.id;
    const newRoomStatus = req.body.newRoomStatus; // Trạng thái phòng mới được gửi trong request body

    try {
        // Cập nhật trạng thái phòng của hóa đơn dựa trên mã hóa đơn
        const updatedRows = await BookingRoom.update({
            trangThaiPhong: newRoomStatus
        }, {
            where: {
                maHoaDon: maHoaDon
            }
        });
        if (updatedRows[0] === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn để cập nhật trạng thái phòng'
            });
        }

        // Nếu trạng thái là "checkout" hoặc "đã hủy", tăng lại số lượng phòng
        if (newRoomStatus === 'Đã Check-out' || newRoomStatus === 'Đã hủy') {
            // Lấy danh sách chi tiết đặt phòng từ hóa đơn
            const detailBookings = await DetailBookingRoom.findAll({
                where: {
                    maHoaDon: maHoaDon
                }
            });

            // Duyệt qua từng chi tiết đặt phòng và tăng lại số lượng phòng
            for (const detailBooking of detailBookings) {
                const categoryId = detailBooking.maLoaiPhong;
                const soLuongPhong = detailBooking.SoLuongPhong;

                // Tìm và cập nhật số lượng phòng cho loại phòng tương ứng
                const categoryRoom = await CategoryRoom.findByPk(categoryId);
                if (categoryRoom) {
                    categoryRoom.soLuong += soLuongPhong;
                    await categoryRoom.save();
                } else {
                    console.error('Không tìm thấy loại phòng', categoryId);
                    return res.status(500).json({
                        message: 'Lỗi server'
                    });
                }
            }
        }

        // Gửi kết quả về client
        res.json({
            message: 'Cập nhật trạng thái phòng thành công',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
routerPayment.get('/searchBookingById', async (req, res) => {
    const maHoaDon = req.query.maHoaDon;

    if (!maHoaDon) {
        return res.status(400).json({
            message: 'Thiếu mã hóa đơn để tìm kiếm'
        });
    }

    try {
        // Tìm kiếm chi tiết đặt phòng dựa trên mã hóa đơn
        const bookingDetails = await DetailBookingRoom.findAll({
            where: {
                maHoaDon: maHoaDon
            },
            include: [{
                    model: BookingRoom,
                    as: 'booking',
                },
                {
                    model: CategoryRoom,
                    as: 'room',
                    include: [{
                            model: ImgRoom,
                            as: 'images',
                        },
                        {
                            model: Hotel,
                            as: 'Hotel',
                            include: [{
                                model: ImgHotel,
                                as: 'ImgHotel'
                            }]
                        }
                    ]
                }
            ]
        });

        if (!bookingDetails || bookingDetails.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy chi tiết đặt phòng với mã hóa đơn cung cấp'
            });
        }

        // Gửi kết quả về client
        res.json({
            bookingDetails: bookingDetails,
        });
    } catch (error) {
        console.error('Lỗi khi tìm kiếm chi tiết đặt phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});

routerPayment.put('/updateBookingStatus', async (req, res) => {
    const newStatus = req.body.newStatus;
    const bookingIds = req.body.bookingIds; // Danh sách ID hóa đơn để cập nhật

    try {
        // Kiểm tra nếu danh sách ID hóa đơn không được cung cấp hoặc rỗng
        if (!bookingIds || bookingIds.length === 0) {
            return res.status(400).json({
                message: 'Không có ID hóa đơn nào được cung cấp để cập nhật'
            });
        }

        // Cập nhật trạng thái cho các hóa đơn có ID trong danh sách và trạng thái là 'Chờ xác nhận'
        const updatedRows = await BookingRoom.update({
            trangThaiPhong: newStatus
        }, {
            where: {
                maHoaDon: bookingIds,
                trangThaiPhong: 'Chờ xác nhận'
            }
        });

        if (updatedRows[0] === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn với trạng thái "Chờ xác nhận" để cập nhật'
            });
        }

        res.json({
            message: `Trạng thái của các hóa đơn đã được cập nhật thành công`
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái đặt phòng:', error);
        res.status(500).json({
            message: 'Lỗi server'
        });
    }
});
const { Op, fn, col, literal } = require('sequelize');

routerPayment.get('/statistics/bookings', async (req, res) => {
    try {
        const filter = req.query.filter;
        let startDate, endDate;

        switch (filter) {
            case 'day':
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0); // Đặt bắt đầu ngày hiện tại
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999); // Đặt cuối ngày hiện tại
                break;
            case 'week':
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case 'month':
                startDate = new Date();
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date();
                break;
            default:
                return res.status(400).json({ message: 'Bộ lọc không hợp lệ' });
        }

        const statistics = await BookingRoom.findAll({
            attributes: [
                [fn('DATE', col('ngayDatPhong')), 'date'],
                [fn('COUNT', col('maHoaDon')), 'count']
            ],
            where: {
                ngayDatPhong: {
                    [Op.between]: [startDate, endDate]
                }
            },
            group: [fn('DATE', col('ngayDatPhong'))],
            raw: true
        });

        res.json(statistics);
    } catch (error) {
        console.error('Lỗi khi lấy thống kê đặt phòng:', error);
        return res.status(500).json({ message: 'Lỗi server' });
    }
});



// hủy đơn
routerPayment.put('/updateRoomStatusBookingRoom/:id', async (req, res) => {
    const maHoaDon = req.params.id;
    const TrangThaiDaHuy = 'Đã hủy';
    try {
        // Tìm thông tin hóa đơn được hủy
        const bookingRoom = await BookingRoom.findOne({
            where: {
                maHoaDon: maHoaDon
            }
        });

        if (!bookingRoom) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn để cập nhật trạng thái phòng'
            });
        }
        // Lấy danh sách chi tiết đặt phòng từ hóa đơn
        const detailBookings = await DetailBookingRoom.findAll({
            where: {
                maHoaDon: maHoaDon
            }
        });
        // Duyệt qua từng chi tiết đặt phòng và tăng lại số lượng phòng
        for (const detailBooking of detailBookings) {
            const categoryId = detailBooking.maLoaiPhong;
            const soLuongPhong = detailBooking.SoLuongPhong;
            // Tìm và cập nhật số lượng phòng cho loại phòng tương ứng
            const categoryRoom = await CategoryRoom.findByPk(categoryId);
            if (categoryRoom) {
                categoryRoom.soLuong += soLuongPhong;
                await categoryRoom.save();
            } else {
                console.error('Không tìm thấy loại phòng', categoryId);
                return res.status(500).json({
                    message: 'Lỗi server'
                });
            }
        }
        // Cập nhật trạng thái hóa đơn thành "Đã hủy"
        await BookingRoom.update({
            trangThaiPhong: TrangThaiDaHuy
        }, {
            where: {
                maHoaDon: maHoaDon
            }
        });

        // Gửi kết quả về client
        res.json({
            message: 'Bạn đã hủy phòng và số lượng phòng đã được tăng lại',
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái phòng:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});


routerPayment.get('/getAllOrderByStatus', async (req, res) => {
    try {
        const confirmedBookings = await BookingRoom.findAll({
            where: {
                trangThaiPhong: 'Đã xác nhận'
            }
        });
        if (confirmedBookings.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn nào có trạng thái phòng là Đã xác nhận.'
            });
        }
        res.json(confirmedBookings);
    } catch (error) {
        console.error('Lỗi khi lấy hóa đơn:', error);
        return res.status(500).json({
            message: 'Lỗi server'
        });
    }
});


routerPayment.get('/getOrderByIdUser/:id', async (req, res) => {
    const userEmail = req.params.id;
    try {
        const invoices = await BookingRoom.findAll({
            where: {
                emailKhachHang: userEmail
            },
        });
        res.status(200).json({
            invoices
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin hóa đơn:', error);
        return res.status(500).json({
            message: 'Lỗi server',
        });
    }
});
routerPayment.delete('/deleteOrder/:id', async (req, res) => {
    const maDon = req.params.id;

    try {
        // Tìm order theo mã hóa đơn
        const order = await BookingRoom.findOne({
            where: {
                maHoaDon: maDon
            }
        });

        if (!order) {
            return res.status(404).json({
                message: 'Không tìm thấy hóa đơn'
            });
        }

        // Xóa các chi tiết đặt phòng liên quan
        await DetailBookingRoom.destroy({
            where: {
                maDatPhong: order.id
            }
        });

        // Xóa hóa đơn
        await BookingRoom.destroy({
            where: {
                maHoaDon: maDon
            }
        });

        return res.status(200).json({
            message: 'Xóa hóa đơn thành công'
        });
    } catch (error) {
        console.error('Lỗi khi xóa hóa đơn:', error);
        return res.status(500).json({
            message: 'Lỗi server',
        });
    }
});

routerPayment.get('/vnpay_return', function (req, res, next) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let config = require('config');
    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, {
        encode: false
    });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");


    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

        res.render('success', {
            code: vnp_Params['vnp_ResponseCode']
        })
    } else {
        res.render('success', {
            code: '97'
        })
    }
});

routerPayment.get('/vnpay_ipn', function (req, res, next) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let config = require('config');
    let secretKey = config.get('vnp_HashSecret');
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, {
        encode: false
    });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");


    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) { //kiểm tra checksum
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
                    if (rspCode == "00") {
                        //thanh cong
                        //paymentStatus = '1'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
                        res.status(200).json({
                            RspCode: '00',
                            Message: 'Success'
                        })
                    } else {
                        //that bai
                        //paymentStatus = '2'
                        // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
                        res.status(200).json({
                            RspCode: '00',
                            Message: 'Success'
                        })
                    }
                } else {
                    res.status(200).json({
                        RspCode: '02',
                        Message: 'This order has been updated to the payment status'
                    })
                }
            } else {
                res.status(200).json({
                    RspCode: '04',
                    Message: 'Amount invalid'
                })
            }
        } else {
            res.status(200).json({
                RspCode: '01',
                Message: 'Order not found'
            })
        }
    } else {
        res.status(200).json({
            RspCode: '97',
            Message: 'Checksum failed'
        })
    }
});

routerPayment.post('/querydr', function (req, res, next) {

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('config');
    let crypto = require("crypto");

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'querydr';
    let vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let currCode = 'VND';
    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TxnRef + "|" + vnp_TransactionDate + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;

    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };
    // /merchant_webapi/api/transaction
    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, function (error, response, body) {
        console.log(response);
    });

});
routerPayment.post('/refund', function (req, res, next) {

    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();

    let config = require('config');
    let crypto = require("crypto");

    let vnp_TmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnp_Api = config.get('vnp_Api');

    let vnp_TxnRef = req.body.orderId;
    let vnp_TransactionDate = req.body.transDate;
    let vnp_Amount = req.body.amount;
    let vnp_TransactionType = req.body.transType;
    let vnp_CreateBy = req.body.user;

    let currCode = 'VND';

    let vnp_RequestId = moment(date).format('HHmmss');
    let vnp_Version = '2.1.0';
    let vnp_Command = 'refund';
    let vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;

    let vnp_IpAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;


    let vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    let vnp_TransactionNo = '0';

    let data = vnp_RequestId + "|" + vnp_Version + "|" + vnp_Command + "|" + vnp_TmnCode + "|" + vnp_TransactionType + "|" + vnp_TxnRef + "|" + vnp_Amount + "|" + vnp_TransactionNo + "|" + vnp_TransactionDate + "|" + vnp_CreateBy + "|" + vnp_CreateDate + "|" + vnp_IpAddr + "|" + vnp_OrderInfo;
    let hmac = crypto.createHmac("sha512", secretKey);
    let vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

    let dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': vnp_TmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': vnp_IpAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, function (error, response, body) {
        console.log(response);
    });

});

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = routerPayment;