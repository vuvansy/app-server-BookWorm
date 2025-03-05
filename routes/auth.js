var express = require('express');
var router = express.Router();

const { loginUserAPI, postCreateUserAPI
} = require('../controllers/UserController')




router.post('/auth/login', loginUserAPI);
router.post('/auth/logout', postCreateUserAPI);

module.exports = router;