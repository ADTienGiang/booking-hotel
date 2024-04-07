const express = require("express");
const {
    Verifycomments,
    GetcommentHotels,
    AddcommentHotels,
} = require("../controllers/EvaluateController.js");
const routerEvaluate = express.Router();

routerEvaluate.post('/api/Verifycomments',Verifycomments);
routerEvaluate.post('/api/AddcommentHotels',AddcommentHotels);
routerEvaluate.get('/api/GetcommentHotels/:id',GetcommentHotels);
module.exports = routerEvaluate;
