var express = require('express');
var router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { loginUserAPI, getUserAccount, logoutUserAPI, forgotPasswordAPI,
    resetPasswordAPI, changePasswordAPI
} = require('../controllers/UserController')




router.get('/auth/account', getUserAccount);
router.post('/auth/login', loginUserAPI);
router.post('/auth/logout', logoutUserAPI);
router.post('/auth/forgot-password', forgotPasswordAPI);
router.post('/auth/reset-password', resetPasswordAPI);
router.patch("/auth/change-password", authMiddleware, changePasswordAPI);

module.exports = router;