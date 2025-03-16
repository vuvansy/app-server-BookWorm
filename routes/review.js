var express = require('express');
var router = express.Router();

const { createReviewAPI, getUserReviews, getReviewsByBookAPI
} = require('../controllers/ReviewController')


// router.get('/genre', getGenreAPI);
router.post('/review', createReviewAPI);
router.get("/review/:id_user", getUserReviews);
router.get("/review/book/:bookId", getReviewsByBookAPI);

module.exports = router;