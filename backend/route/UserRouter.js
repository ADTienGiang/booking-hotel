const express =require("express") ;
const {
    registerUser,
    loginUser,
    getAllUser,
    getUserById,
    updateUserById,
    resetPassword,
    deleteUser,
    testAPIBookingUser
} =require("../controllers/UserController.js") ;
const routerUser = express.Router();

routerUser.post('/api/register', registerUser);
routerUser.post('/api/login', loginUser);
routerUser.get('/api/getall',getAllUser);
routerUser.get('/api/getUserById/:id',getUserById);
routerUser.get('/api/testAPIBookingUser',testAPIBookingUser);
routerUser.put('/api/updateUserById/:id', updateUserById);
routerUser.put('/api/resetPassword', resetPassword);
routerUser.delete('/api/deleteUser/:id',deleteUser);
module.exports = routerUser;
