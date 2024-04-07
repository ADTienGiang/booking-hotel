const express = require("express");
const {

    loginAdmin,
} = require("../controllers/AdminController.js");
const routerAdmin = express.Router();

routerAdmin.post('/api/loginAdmin', loginAdmin);

module.exports = routerAdmin;
