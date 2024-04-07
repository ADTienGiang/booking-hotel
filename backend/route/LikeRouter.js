const express =require("express") ;
const {
    HotelLike,
    HotelSeen,
    renderlike,
    renderseen

} =require("../controllers/LikeController") ;
const routerFollow = express.Router();

routerFollow.post('/api/addlike',HotelLike);
routerFollow.post('/api/addseen',HotelSeen);
routerFollow.get('/api/getlike/:id',renderlike);
routerFollow.get('/api/getseen/:id',renderseen);

module.exports = routerFollow;
