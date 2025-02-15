
var express = require('express');
var router = express.Router();

const { getBookAPI
 } = require('../controllers/BookController')


router.get('/book', getBookAPI);


module.exports = router;