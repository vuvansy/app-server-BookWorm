var express = require('express');
var router = express.Router();

const { loginUserAPI, getUserAccount, logoutUserAPI
} = require('../controllers/UserController')




router.get('/auth/account', getUserAccount);
router.post('/auth/login', loginUserAPI);
router.post('/auth/logout', logoutUserAPI);

module.exports = router;