var express = require('express');
var router = express.Router();

const {
    getBookAPI,
    postCreateBook,
    getBookByIdAPI,
    putUpdateBook,
    deleteABook,
    getFlashSaleBooks,
    getBooksByGenreAPI,
    getNewBooksAPI
} = require('../controllers/BookController')


router.get('/book', getBookAPI);
router.post('/book', postCreateBook);
router.get("/book/flash-sale", getFlashSaleBooks);
router.get("/book/new", getNewBooksAPI);
router.get("/book/:id/genre/:id_genre", getBooksByGenreAPI);
router.put('/book/:id', putUpdateBook);
router.delete('/book/:id', deleteABook);
router.get('/book/:id', getBookByIdAPI);

module.exports = router;