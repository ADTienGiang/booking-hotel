const express = require('express');
const app = express();
var logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require("cors");
const passport = require('passport');
const bodyParser = require('body-parser');

// Cấu hình CORS
const corsOptions = {
    origin: '*',
};
app.use(cors(corsOptions));

// Cấu hình Passport
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

// Cấu hình Passport cho Facebook và Google
require('./passport/passport-facebook')(passport);
require('./passport/passport-google')(passport);

// Cấu hình body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Kết nối cơ sở dữ liệu
require('./config/ConnectDatabase.js');

// Cấu hình session
app.use(session({
    secret: 'keysaveloginuser123456',
    resave: false,
    saveUninitialized: false
}));

// Cấu hình logger
// app.use(logger('dev'));

// Cấu hình router
const router = require('./route/index');
app.use(router);
// javascript = js
// Cấu hình cookie-parser
app.use(cookieParser());

// Sử dụng passport và express.json middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// Serve các tệp tĩnh từ thư mục "uploads"
app.use(express.static("uploads"));
// 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
// Khởi động máy chủ
const port = 3000;
app.listen(port, () => {
    console.log(`API đang chạy : http://localhost:${port}/`);
});
