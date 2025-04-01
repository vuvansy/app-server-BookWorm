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
    getNewBooksAPI,
    searchBooksAPI,
    getDeletedBooksAPI,
    restoreDeletedBookAPI,
    getTrendingBooks,
    updateBookQuantityAPI
} = require('../controllers/BookController')


router.get('/book', getBookAPI);
router.post('/book', postCreateBook);
router.get('/book/flash-sale', getFlashSaleBooks);
router.get('/book/trending', getTrendingBooks);
router.get('/book/new', getNewBooksAPI);
router.get('/book/search', searchBooksAPI);
router.get('/book/:id/genre/:id_genre/author/:authorIds', getBooksByGenreAPI);
router.put('/book/:id', putUpdateBook);
router.put('/book/update-quantity/:bookId', updateBookQuantityAPI);
router.delete('/book/:id', deleteABook);
router.get('/book/deleted', getDeletedBooksAPI);
router.patch("/book/restore/:id", restoreDeletedBookAPI);
//
router.get('/book/:id', getBookByIdAPI);
module.exports = router;