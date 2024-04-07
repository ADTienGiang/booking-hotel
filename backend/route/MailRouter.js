const express =require("express");
const {  
    sendMail,
    sendCode,
    sendMailAuth,
    thongBaoThanhCong,
    SendOPT
} =require("../controllers/MailController.js") ;
const routerMail = express.Router();
routerMail.post('/api/send-email',sendMail);
routerMail.post('/api/send-opt',SendOPT);
routerMail.post('/api/send-noti',thongBaoThanhCong);
routerMail.post('/api/send-code',sendCode);
routerMail.post('/api/resetPassword',sendMailAuth);
module.exports = routerMail;
