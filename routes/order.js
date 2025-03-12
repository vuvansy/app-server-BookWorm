var express = require('express');
var router = express.Router();

const {
    getOrderAPI, postCreateOrder
 } = require('../controllers/OrderController')


router.get('/genre', getOrderAPI);
router.post('/genre', postCreateOrder);


module.exports = router;