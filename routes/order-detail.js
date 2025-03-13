var express = require('express');
var router = express.Router();

const { postCreateOrderDetail, getOrderDetails
} = require('../controllers/OrderDetailController')


// router.get('/genre', getGenreAPI);
router.post('/order-detail', postCreateOrderDetail);
router.get("/order-detail/:id_order", getOrderDetails);

module.exports = router;