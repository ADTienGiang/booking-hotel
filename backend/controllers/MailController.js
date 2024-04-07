const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const db = require('../models');
const User = db.users;
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const VITE_API_BASE_URL_API_FRONTEND = process.env.VITE_API_BASE_URL_API_FRONTEND;
const DetailBookingRoom = db.DetailBookingRoom;
const sendMail = async (req, res) => {
  const { name, email, url, maHoaDon ,tenKS } = req.body;
  console.log(maHoaDon);
  // Kiểm tra xem có email hợp lệ không
  if (!email || !email.includes('@')) {
    res.status(400).json({
      message: 'Email không hợp lệ'
    });
    return;
  }
  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    // Tìm chi tiết đặt phòng dựa vào mã hóa đơn
    const detailBooking = await DetailBookingRoom.findOne({
      where: { maHoaDon: maHoaDon }
    });
    if (!detailBooking) {
      console.error('Không tìm thấy chi tiết đặt phòng');
      res.status(500).json({
        message: 'Không tìm thấy chi tiết đặt phòng'
      });
      return;
    }
    console.log('trang thai la : '+detailBooking.statusMail)
    // Kiểm tra statusMail trước khi gửi emailv 
    if (detailBooking.statusMail === false) {
      const msg = {
        to: email,
        from: 'nguyenthevann6@gmail.com', // Địa chỉ email gửi đi
        subject: 'Thông báo đặt phòng thành công',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #ffa500; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin-bottom: 20px;">Đơn hàng của bạn đang được xác nhận</h1>
                <p style="font-size: 18px; color: #ffffff; margin-bottom: 10px;">Chào ${name},</p>
                <p style="font-size: 16px; color: #ffffff; margin-bottom: 10px;">Bạn đã đặt phòng thành công!</p>
                <p style="font-size: 16px; color: #ffffff; margin-bottom: 10px;">Mã hóa đơn của bạn là: <strong>${maHoaDon}</strong></p>
                <p style="font-size: 16px; color: #ffffff; margin-bottom: 10px;">Đơn hàng cho khách sạn <strong>${tenKS}</strong></p>
                <a href="${VITE_API_BASE_URL_API_FRONTEND}${url}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">Xem chi tiết</a>
                <p style="font-size: 16px; color: #ffffff; margin-top: 10px;">Vui lòng giữ email này để tham khảo thông tin đặt phòng.</p>
            </div>
        `,
    };
    

      await sgMail.send(msg);

      // Sau khi gửi email thành công, cập nhật trường statusMail trong bảng DetailBookingRoom thành 1
      await detailBooking.update({ statusMail: true });

      res.status(200).json({
        message: 'Gửi email thành công'
      });
    } else {
      // Nếu statusMail đã là 1, không gửi email và trả về thông báo tương ứng
      res.status(200).json({
        message: 'Email đã được gửi trước đó'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Lỗi khi gửi email'
    });
  }
};
const thongBaoThanhCong = async (req, res) => {
  const { name, email,  maHoaDon ,tenKS  } = req.body;
  console.log( 'email la : '+email);

  // Kiểm tra xem có email hợp lệ không
  if (!email || !email.includes('@')) {
    res.status(400).json({
      message: 'Email không hợp lệ'
    });
    return;
  }

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);

    // Tìm chi tiết đặt phòng dựa vào mã hóa đơn
    const detailBooking = await DetailBookingRoom.findOne({
      where: { maHoaDon: maHoaDon }
    });

    if (!detailBooking) {
      console.error('Không tìm thấy chi tiết đặt phòng');
      res.status(500).json({
        message: 'Không tìm thấy chi tiết đặt phòng'
      });
      return;
    }
    console.log('trang thai la : '+detailBooking.statusMail)
    // Kiểm tra statusMail trước khi gửi emailv 
      const msg = {
        to: email,
        from: 'nguyenthevann6@gmail.com', // Địa chỉ email gửi đi
        subject: 'Thông báo đặt phòng thành công',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px; text-align: center;">
            <h1 style="color: #4CAF50; margin-bottom: 20px;">Đơn hàng của bạn đã được xác nhận.</h1>
            <p style="font-size: 18px; color: #333; margin-bottom: 10px;">Chào ${name},</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 10px;">Chúc mừng bạn đã đặt phòng thành công!</p>
            <p style="font-size: 16px; color: #555; margin-bottom: 10px;">Mã hóa đơn của bạn là: <strong>${maHoaDon}</strong></p>
            <p style="font-size: 16px; color: #555; margin-bottom: 10px;">Đơn hàng cho khách sạn <strong>${tenKS}</strong></p>
            <div style="background-color: #4CAF50; margin: 20px 0; padding: 10px;">
              <p style="font-size: 16px; color: #fff;">Vui lòng giữ email này để tham khảo thông tin đặt phòng.</p>
            </div>
            <!-- Thêm thông tin khác nếu cần -->
          </div>
        `,
      };
      await sgMail.send(msg);
      // Sau khi gửi email thành công, cập nhật trường statusMail trong bảng DetailBookingRoom thành 1
      await detailBooking.update({ statusMail: true });
      res.status(200).json({
        message: 'Gửi email thành công'
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Lỗi khi gửi email'
    });
  }
};
const getEmailByUserId = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ['email', 'question']
    });
    return user;
  } catch (error) {
    throw error;
  }
};

const sendQuestionCodeByEmail = async (userId) => {
  try {
    // Lấy thông tin về email và mã question của người dùng
    const user = await getEmailByUserId(userId);

    // Kiểm tra xem có email hợp lệ không
    if (!user.email || !user.email.includes('@')) {
      return {
        success: false,
        message: 'Email không hợp lệ'
      };
    }
    // Kiểm tra xem có mã question hợp lệ không
    if (!user.question) {
      return {
        success: false,
        message: 'Không tìm thấy mã question'
      };
    }

    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: 'nguyenthevann6@gmail.com',
      subject: 'Xác nhận đổi mật khẩu',
      text: `Mã dự phòng của bạn là: ${user.question}`,
    };

    // Gửi email
    await sgMail.send(msg);

    return {
      success: true,
      message: 'Gửi mã question thành công'
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Lỗi khi gửi mã question'
    };
  }
};

const sendCode = async (req, res) => {
  const {
    email
  } = req.body;
  // Kiểm tra xem email có hợp lệ hay không
  if (!email || !email.includes('@')) {
    res.status(400).json({
      message: 'Email không hợp lệ'
    });
    return;
  }

  try {
    // Kiểm tra xem email có trùng với email đã đăng ký và đã xác thực hay không
    const user = await User.findOne({
      where: {
        email
      }
    });
    if (!user) {
      res.status(400).json({
        message: 'Email không tồn tại hoặc chưa xác thực'
      });
      return;
    }

    // Email hợp lệ, gửi mã question cho người dùng
    const result = await sendQuestionCodeByEmail(user.id);
    if (result.success) {
      res.status(200).json({
        message: 'Gửi mã xác thực thành công'
      });
      //console.log('ok'+ SENDGRID_API_KEY)
    } else {
      res.status(500).json({
        message: result.message
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Lỗi khi kiểm tra email'
    });
  }
};
const SendOPT = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Email không hợp lệ' });
  }

  const otp = generateOTP();
  const expiry = new Date();
  expiry.setSeconds(expiry.getSeconds() + 60); // Thêm 60 giây vào thời gian hiện tại

  // Lưu mã OTP và thời gian hết hạn vào cơ sở dữ liệu (cần triển khai)

  try {
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: 'nguyenthevann6@gmail.com',
      subject: 'Mã Xác Thực',
      text: `Mã xác thực của bạn là: ${otp}. Mã này sẽ hết hạn sau 60 giây.`,
    };

    await sgMail.send(msg);
    return res.status(200).json({ message: 'Mã xác thực đã được gửi.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi gửi mã xác thực' });
  }
};

const sendMailAuth = async (req, res) => {
  const {
    email,
    question,
    password
  } = req.body;

  // Kiểm tra xem email có hợp lệ hay không
  if (!email || !email.includes('@')) {
    res.status(400).json({
      message: 'Email không hợp lệ'
    });
    return;
  }

  try {
    // Tìm kiếm người dùng trong database
    const user = await User.findOne({
      where: {
        email
      }
    });

    // Kiểm tra xem người dùng có tồn tại và đã xác thực hay chưa
    if (!user) {
      res.status(400).json({
        message: 'Email không tồn tại hoặc chưa xác thực'
      });
      return;
    }

    // Kiểm tra xem mã question nhập vào có trùng với mã question trong database hay không
    if (user.question !== question) {
      res.status(400).json({
        message: 'Mã question không chính xác'
      });
      return;
    }

    // Kiểm tra tính hợp lệ của mật khẩu
    if (!password || password.length < 6) {
      res.status(400).json({
        message: 'Mật khẩu không hợp lệ, phải có độ dài lớn hơn 6 ký tự'
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    if( user.password === hashedPassword)
    {
      res.status(400).json({
        message: 'Không được trùng với mật khẩu cũ'
      });
    }
    // Cập nhật mật khẩu mới cho người dùng trong database
    user.password = hashedPassword;
    await user.save();

    // Gửi email thông báo đổi mật khẩu thành công
    sgMail.setApiKey(SENDGRID_API_KEY);
    const msg = {
      to: user.email,
      from: 'nguyenthevann6@gmail.com',
      subject: 'Đổi mật khẩu thành công',
      text: `Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại bằng mật khẩu mới.`,
    };
    await sgMail.send(msg);

    res.status(200).json({
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Lỗi khi đổi mật khẩu'
    });
  }
};

module.exports = {
  sendMail,
  sendCode,
  sendMailAuth,
  thongBaoThanhCong,
  SendOPT
};