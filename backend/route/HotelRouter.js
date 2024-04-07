const express = require("express");
const {

    getHotel,
    addHotel,
    updateHotel,
    deleteImage,
    GetDataDetailRoom,
    deleteHotel,
} = require("../controllers/HotelController.js");
const routerHotel = express.Router();

routerHotel.get('/api/getHotel', getHotel);
routerHotel.post('/api/addHotel', addHotel);
routerHotel.put('/api/updateHotel/:id',updateHotel);
routerHotel.delete('/api/deleteImage/:id',deleteImage);
routerHotel.delete('/api/deleteHotel/:id',deleteHotel);
routerHotel.get('/api/GetDataDetailRoom', GetDataDetailRoom);


module.exports = routerHotel;
