const express = require("express");
const {

    getRooms,
    addRooms,
    updateRooms,
    deleteRooms,
    GetRoomByFilter,
    deleteImage,
} = require("../controllers/CategoryRoom.js");
const routerRooms = express.Router();

routerRooms.get('/api/getRooms', getRooms);
routerRooms.post('/api/addRooms', addRooms);
routerRooms.put('/api/updateRooms/:id',updateRooms);
routerRooms.delete('/api/deleteRooms/:id',deleteRooms);
routerRooms.get('/api/GetRoomByFilter',GetRoomByFilter);
routerRooms.delete('/api/deleteImageRooms/:id',deleteImage);
module.exports = routerRooms;
