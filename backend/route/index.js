const express = require('express');
const router  =  express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const routerAdmin = require('./AdminRouter');
const routerHotel = require('./HotelRouter');
const routerProvince = require('./ProvinceRouter');
const routerRooms = require('./CategoryRoomRouter');
const routerPayment = require('../controllers/BookRoomController');
const routerMail = require('./MailRouter');
const routerAPI = require('./UserRouterAPI')
const routerUser = require('./UserRouter')
const routerFollow = require('./LikeRouter')
const routerEvaluate = require('./EvaluateRouter')

router.use(routerAPI,routerPayment,routerAdmin,routerHotel,routerProvince,routerRooms,routerMail,routerUser,routerFollow, routerEvaluate);

module.exports = router;