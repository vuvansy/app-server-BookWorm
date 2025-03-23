var express = require('express');
var router = express.Router();

const {
    postCreateBookLike, getBookLikesByUser, deleteABookLike
} = require('../controllers/BookLikeController')


router.post('/book-like', postCreateBookLike);
router.delete('/book-like/:id', deleteABookLike);
router.get('/book-like/:id_user', getBookLikesByUser);

module.exports = router;