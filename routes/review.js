var express = require('express');
var router = express.Router();

const { createReviewAPI, getUserReviews, getReviewsByBookAPI, getReviewedBooksAPI
} = require('../controllers/ReviewController')


// router.get('/genre', getGenreAPI);
router.post('/review', createReviewAPI);
router.get("/review/book/:bookId", getReviewsByBookAPI);
router.get("/review/list-book", getReviewedBooksAPI);

router.get("/review/:id_user", getUserReviews);

module.exports = router;