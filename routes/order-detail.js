var express = require('express');
var router = express.Router();

const { postCreateOrderDetail
} = require('../controllers/OrderDetailController')


// router.get('/genre', getGenreAPI);
router.post('/order-detail', postCreateOrderDetail);


module.exports = router;