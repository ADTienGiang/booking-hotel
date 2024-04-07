const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('../models');
const User = db.User;
const BookingRoom = db.BookingRoom;
const sequelize = require('sequelize');

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const API_KEY_CHECK_MAIL = process.env.API_KEY_CHECK_MAIL;
//register user
const axios = require('axios');
const headers = {
  'apikey': API_KEY_CHECK_MAIL
};
const registerUser = async (req, res) => {
  const {
    username,
    password,
    email,
    phone,
    address,
    NgaySinh
  } = req.body;
  try {
    // Kiểm tra xem email đã được sử dụng chưa
    const existingUser = await User.findOne({
      where: {
        email
      }
    });
    if (existingUser) {
      return res.status(400).json({
        message: 'Email đã tồn tại trong hệ thống'
      });
    }
    const encodedEmail = encodeURIComponent(email);
    const url = `http://api.apilayer.com/email_verification/check?email=${encodedEmail}`;

    try {
      const response = await axios.get(url, {
        headers
      });
      const emailVerificationResult = response.data;
      await continueRegister(emailVerificationResult);
    } catch (error) {
      return res.status(500).json({
        message: 'Lỗi xác minh email'
      });
    }

    // Hàm tiếp tục quá trình đăng ký
    async function continueRegister(emailVerificationResult) {
      // Kiểm tra kết quả xác minh email từ API
      if (!emailVerificationResult.format_valid || !emailVerificationResult.mx_found || !emailVerificationResult.smtp_check) {
        return res.status(400).json({
          message: 'Email không tồn tại'
        });
      }
      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      console.log('mat khau chua hash : ' + password + ', mat khau da hash : ' + salt + 'hash' + hashedPassword)
      // Tạo một user mới
      const user = await User.create({
        email,
        Matkhau: hashedPassword, // Lưu mật khẩu đã mã hóa vào cơ sở dữ liệu
        HoVaTen: username,
        DiaChi: address,
        Sdt: phone,
        ngaySinh: NgaySinh,
        socialID: 'không sử dụng',
        avtUrl: 'default'
      });

      res.json({
        user,
        message: "Đăng ký tài khoản thành công!"
      });
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: 'Đăng ký thất bại'
    });
  }
};
//login user
const loginUser = async (req, res) => {
  const {
    email,
    password
  } = req.body;
  console.log(req.body)
  try {
    // Tìm kiếm khách hàng với email cung cấp
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      return res.status(400).json({
        message: 'khong tim thay tai khoan'
      });
    }
    // So sánh mật khẩu được cung cấp với mật khẩu đã được mã hóa
    const isMatch = await bcrypt.compare(password, user.Matkhau);
    console.log(password)
    if (!isMatch) {
      return res.status(400).json({
        message: 'Tài khoản hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT
    const token = jwt.sign({
      userId: user.id
    }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN
    });
    // Trả về JWT và thông tin người dùng
    res.json({
      id: user.id,
      HoVaTen: user.HoVaTen,
      email: user.email,
      Matkhau: user.Matkhau,
      address: user.DiaChi,
      Sdt: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      avtUrl: user.avtUrl,
      token
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      error: 'Đăng nhập thất bại'
    });
    console.log("loi" + error)
  }
};
//test api
const getAllUser = async (req, res) => {
  try {
    const user = await User.findAll();
    res.json(user);
  } catch (error) {
    res.json("không lấy được khách hàng" + error);
    console.log(error);
  }
};
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        message: `User with id ${userId} not found.`
      });
    } else {
      res.json(user);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user with id " + userId
    });
  }
};
const updateUserById = async (req, res) => {
  const userId = req.params.id;
  console.log(req.body);
  const {
    HoVaTen,
    email,
    Sdt,
    DiaChi,
    ngaySinh,
    Matkhau,
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({
        message: `User with id ${userId} not found.`
      });
    } else {
      let hashedPassword = user.hashedPassword;
      if (Matkhau) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(Matkhau, salt);
      }

      await user.update({
        HoVaTen,
        email,
        Sdt,
        DiaChi,
        ngaySinh,
        Matkhau: hashedPassword,
        socialID : 'đăng nhập truyền thống',
        avtUrl : 'Mặc định'
      });

      res.json({
        message: `Cập nhật thông tin thành công`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating user with id " + userId
    });
  }
};
const resetPassword = async (req, res) => {

  console.log(req.body);
  const {
    email,
    question,
    password
  } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email
      }
    });
    const questions = await User.findOne({
      where: {
        email,
        question
      }
    })
    if (!user) {
      res.status(404).json({
        message: `Không tồn tại tài khoản.`
      });
    } else if (!questions) {
      res.status(404).json({
        message: `Mã bảo mật sai`
      });
    } else {
      let hashedPassword = user.hashedPassword;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
      }

      await user.update({
        password: hashedPassword
      });

      res.json({
        message: `Cập nhập thành công mật khẩu mới`
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi cập nhập"
    });
  }
};
const deleteUser = async (req, res) => {
  const UserId = req.params.id;
  try {
    const Users = await User.findOne({
      where: {
        id: req.params.id
      }
    });
    if (!Users) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng"
      });
    }
    const BookingRooms = await BookingRoom.findAll({
      where: {
        MaKhachHang: UserId
      }
    });
    if (BookingRooms.length > 0) {
      return res.status(400).json({
        message: "Người dùng đã tồn tại đơn hàng, không thể xóa"
      });
    }
    await Users.destroy();
    res.status(200).json({
      message: "Xóa người dùng thành công"
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      message: "Lỗi trong quá trình xóa người dùng"
    });
  }
}

const testAPIBookingUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        HoVaTen: {
          [sequelize.Op.like]: 'A%'
        }
      }
    });

    if (users.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy user có tên bắt đầu bằng chữ A."
      });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy dữ liệu từ cơ sở dữ liệu"
    });
  }
};


module.exports = {
  registerUser,
  loginUser,
  getAllUser,
  getUserById,
  updateUserById,
  resetPassword,
  deleteUser,
  testAPIBookingUser
};