const express = require("express");
const {
    getProvince,
    addProvince,
    updateProvince,
    deleteProvince,
    deleteImageProvince,
    getHotelsInProvinceWithFilter
} = require("../controllers/ProvinceController");
const routerProvince = express.Router();
routerProvince.get('/api/getProvince', getProvince);
routerProvince.get('/api/getHotelsInProvinceWithFilter', getHotelsInProvinceWithFilter);
routerProvince.post('/api/addProvince', addProvince);
routerProvince.put('/api/updateProvince/:id',updateProvince);
routerProvince.delete('/api/deleteProvince/:id',deleteProvince);
routerProvince.delete('/api/deleteImageProvince/:id',deleteImageProvince);
module.exports = routerProvince;
