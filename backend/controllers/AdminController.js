const CryptoJS = require('crypto-js');
const db = require('../models');
const Admin = db.Admin;
const jwt = require('jsonwebtoken');
const dotenv = require ( 'dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      throw new Error('Email không được để trống');
    }
    const admin = await Admin.findOne({ where: { email } });
    if (!admin || !comparePassword(password, admin.MatKhau)) {
      throw new Error('Email hoặc mật khẩu không đúng');
    }                                                           
    const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.status(200).json({ message: 'Đăng nhập thành công', token , admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi server', error: err });
  }
};
const comparePassword = (password, hash) => {
  const hashedPassword = CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  return hash === hashedPassword;
};
module.exports = {
  loginAdmin,
};