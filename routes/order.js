var express = require('express');
var router = express.Router();

const {
 postCreateOrder
 } = require('../controllers/OrderController')


// router.get('/order', getOrderAPI);
router.post('/order', postCreateOrder);


module.exports = router;