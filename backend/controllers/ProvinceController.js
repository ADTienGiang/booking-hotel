const db = require('../models');
const Hotel = db.Hotel;
const Province = db.Province;
const CategoryRoom = db.CategoryRoom;

const ImgHotel = db.ImgHotel;
const sequelize = require('sequelize');
const multer = require('multer');
const env = require('dotenv').config();
const {
    Op
} = require('sequelize');
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
const getProvince = async (req, res) => {
    try {
        const provinces = await Province.findAll({
            attributes: ['id', 'tenTinhThanh', 'hinhAnh'],
        });
        const formattedProvince = provinces.map((province) => ({
            id: province.id,
            tenTinhThanh: province.tenTinhThanh,
            hinhAnh: province.hinhAnh,
        }));
        res.json(formattedProvince);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Lỗi server',
            error: err,
        });
    }
};
// Lấy thông tin tỉnh thành cùng với danh sách khách sạn, bỏ qua tỉnh không có khách sạn
const getHotelsInProvinceWithFilter = async (req, res) => {
    try {
        // Truy vấn thông tin tỉnh thành có khách sạn và liên kết với thông tin khách sạn và phòng
        const provincesWithHotels = await Province.findAll({
            attributes: ['id', 'tenTinhThanh', 'hinhAnh'],
            include: [{
                model: Hotel,
                as: 'Hotel',
                attributes: ['id', 'tenKhachSan', 'diaChi', 'dienThoai', 'tienIch', 'kinhDo', 'viDo'],
                required: true, // Chỉ lấy các tỉnh có khách sạn
                include: [{
                    model: CategoryRoom,
                    as: 'CategoryRoom',
                    attributes: ['id', 'tenLoaiPhong', 'MaKhachSan'],
                }]
            }]
        });

        // Định dạng dữ liệu trả về
        const formattedData = provincesWithHotels.map(province => {
            return {
                id: province.id,
                tenTinhThanh: province.tenTinhThanh,
                hinhAnh: province.hinhAnh,
                Hotel: province.Hotel.map(hotel => {
                    return {
                        id: hotel.id,
                        tenKhachSan: hotel.tenKhachSan,
                        diaChi: hotel.diaChi,
                        hinhAnh: hotel.hinhAnh,
                        moTa: hotel.moTa,
                        CategoryRoom: hotel.CategoryRoom.map(room => {
                            return {
                                id: room.id,
                                tenLoaiPhong: room.tenLoaiPhong,
                                giaPhong: room.giaPhong,
                                moTa: room.moTa,
                                soLuongPhong: room.soLuongPhong
                            };
                        })
                    };
                })
            };
        });

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Lỗi server',
            error: err,
        });
    }
};

// Thêm một khách sạn mới
const addProvince = async (req, res) => {
    try {
        upload.array('hinhAnh', 20)(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: 'Lỗi tải lên hình ảnh'
                });
            }

            const {
                tenTinhThanh,
                code
            } = req.body;
            console.log(req.body);

            // Kiểm tra xem tỉnh thành đã tồn tại chưa
            const existingProvince = await Province.findOne({
                where: {
                    [Op.or]: [{
                        tenTinhThanh
                    }, {
                        code
                    }]
                }
            });

            if (existingProvince) {
                return res.status(400).json({
                    message: 'Tỉnh thành đã tồn tại'
                });
            }

            // Thêm tỉnh thành mới nếu chưa tồn tại
            req.files.map(async (file) => {
                await Province.create({
                    tenTinhThanh,
                    code,
                    hinhAnh: `${req.protocol}://${req.get('host')}/${file.filename}`
                });
            });

            return res.status(201).json({
                message: 'Thêm tỉnh thành thành công'
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Thêm tỉnh thành thất bại'
        });
    }
};

// Cập nhật khách sạn
const updateProvince = async (req, res) => {
    try {
        upload.single('hinhAnh')(req, res, async function (err) {
            if (err) {
                return res.status(400).json({
                    message: 'Lỗi tải lên hình ảnh'
                });
            }

            const {
                code
            } = req.body;

            const province = await Province.findOne({
                where: {
                    code
                }
            });

            if (!province) {
                return res.status(404).json({
                    message: 'Không tìm thấy tỉnh thành'
                });
            }

            // Cập nhật hình ảnh nếu có
            if (req.file) {
                province.hinhAnh = `${req.protocol}://${req.get('host')}/${req.file.filename}`;
            }

            await province.save();
            return res.status(200).json({
                message: 'Cập nhật hình ảnh tỉnh thành thành công'
            });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Cập nhật hình ảnh tỉnh thành thất bại'
        });
    }
};


// Xóa tỉnh thành
const deleteProvince = async (req, res) => {
    const provinceId = req.params.id;
    try {
        // Kiểm tra xem tỉnh thành có khách sạn hay không
        const hotelsInProvince = await Hotel.findAll({
            where: {
                MaTinh: provinceId
            }
        });

        if (hotelsInProvince.length > 0) {
            // Nếu tỉnh thành đã có khách sạn, trả về thông báo cảnh báo
            return res.status(400).json({
                message: "Tỉnh thành đã tồn tại khách sạn, không thể xóa"
            });
        }

        // Nếu không có khách sạn, tiến hành xóa tỉnh thành
        await Province.destroy({
            where: {
                id: provinceId
            }
        });

        res.status(200).json({
            message: "Xóa tỉnh thành thành công"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Lỗi khi xóa tỉnh thành"
        });
    }
}



const deleteImageProvince = async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const province = await Province.findOne({
            where: {
                id
            }
        });

        if (!province) {
            return res.status(404).json({
                message: 'Province không tồn tại'
            });
        }

        // Nếu bạn cũng muốn xóa file hình ảnh từ server hoặc dịch vụ lưu trữ,
        // bạn cần thêm logic tại đây để xử lý việc đó.

        // Cập nhật trường hinhAnh thành null hoặc xóa giá trị
        province.hinhAnh = null;
        await province.save();

        res.status(200).json({
            message: 'Đã xóa hình ảnh'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Lỗi khi xóa hình ảnh'
        });
    }
};


module.exports = {
    getProvince,
    addProvince,
    deleteProvince,
    updateProvince,

    deleteImageProvince,
    getHotelsInProvinceWithFilter
};