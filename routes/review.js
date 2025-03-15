var express = require('express');
var router = express.Router();

const { createReviewAPI, getUserReviews
} = require('../controllers/ReviewController')


// router.get('/genre', getGenreAPI);
router.post('/review', createReviewAPI);
router.get("/review/:id_user", getUserReviews);

module.exports = router;