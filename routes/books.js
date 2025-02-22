
var express = require('express');
var router = express.Router();

const { getBookAPI, postCreateBook, getBookByIdAPI
 } = require('../controllers/BookController')


router.get('/book', getBookAPI);
router.post('/book', postCreateBook);

router.get('/book/:id', getBookByIdAPI);

module.exports = router;