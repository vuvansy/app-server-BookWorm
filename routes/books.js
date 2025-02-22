
var express = require('express');
var router = express.Router();

const { getBookAPI, postCreateBook
 } = require('../controllers/BookController')


router.get('/book', getBookAPI);
router.post('/book', postCreateBook);

module.exports = router;