const db = require('../models');
const hotels = db.Hotel;
const Like = db.Like;
const ImgHotel = db.ImgHotel;
const CategoryRoom = db.CategoryRoom;
const Evaluate = db.Evaluate;

const HotelLike = async (req, res) => {
    const {
        maKhachHang,
        maKhachSan,
        status
    } = req.body;
    const existLike = await Like.findOne({
        where: {
            maKhachHang,
            maKhachSan
        }
    });
    if (existLike) {
        const follow = await Like.update({
            status
        }, {
            where: {
                maKhachHang: maKhachHang,
                maKhachSan: maKhachSan
            }
        });
        res.status(200).json({
            follow,
            message: "san pham thich"
        })
    } else {
        const status_seen = false;
        const follow = await Like.create({
            maKhachHang,
            maKhachSan,
            status,
            status_seen
        });
        res.status(200).json({
            follow,
            message: "Thêm thành công san pham thich"
        })
    }
};
const HotelSeen = async (req, res) => {
    const {
        maKhachHang,
        maKhachSan,
        status
    } = req.body;
    console.log(req.body)
    const existLike = await Like.findOne({
        where: {
            maKhachHang,
            maKhachSan
        }
    });
    if (existLike) {
        const follow = await Like.update({
            status_seen :status
        }, {
            where: {
                maKhachHang: maKhachHang,
                maKhachSan: maKhachSan
            }
        });
        res.status(200).json({
            follow,
            message: "san pham thich"
        })
    } else {
        const follow = await Like.create({
            maKhachHang,
            maKhachSan,
            status_seen : status,
            status : false,
        });
        res.status(200).json({
            follow,
            message: "Thêm thành công san pham thich"
        })
    }
};

const renderlike = async (req, res) => {
    const maKhachHang = req.params.id;
    try {
        const like = await Like.findAll({
            attributes: ['id', 'maKhachHang', 'maKhachSan', 'status', 'status_seen'],
            include: [{
                model: hotels,
                as: 'hotels',
                include: [{
                        model: ImgHotel,
                        as: 'ImgHotel',
                    },
                    {
                        model: CategoryRoom,
                        as: 'CategoryRoom',
                    },
                    {
                        model: Evaluate,
                        as: 'Evaluate',
                    },
                ],
            }],
            where: {
                maKhachHang: maKhachHang,
                status: true, // Add this condition to filter by status
            }
        });

        res.json(like);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Không lấy được dữ liệu"
        });
    }
};

const renderseen = async (req, res) => {
    const maKhachHang = req.params.id;
    try {
        const seen = await Like.findAll({
            attributes: ['id', 'maKhachHang', 'maKhachSan', 'status', 'status_seen'],
            include: [{
                model: hotels,
                as: 'hotels',
                include: [{
                        model: ImgHotel,
                        as: 'ImgHotel',
                    },
                    {
                        model: CategoryRoom,
                        as: 'CategoryRoom',
                    },
                    {
                        model: Evaluate,
                        as: 'Evaluate',
                    },
                ],
            }],
            where: {
                maKhachHang: maKhachHang,
                status_seen: true, // Add this condition to filter by status
            }
        });
        res.json(seen);
    } catch (error) {
        res.json("không lấy được ");
        console.log(error);
    }
};
module.exports = {
    HotelLike,
    HotelSeen,
    renderlike,
    renderseen
}