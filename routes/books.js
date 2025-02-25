var express = require('express');
var router = express.Router();

const {
    getBookAPI,
    postCreateBook,
    getBookByIdAPI,
    putUpdateBook,
    deleteABook
} = require('../controllers/BookController')


router.get('/book', getBookAPI);
router.post('/book', postCreateBook);
router.put('/book/:id', putUpdateBook);
router.get('/book/:id', getBookByIdAPI);
router.delete('/book/:id', deleteABook);

module.exports = router;