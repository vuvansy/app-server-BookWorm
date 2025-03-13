var express = require('express');
var router = express.Router();

const {
    postCreateOrder, getOrdersByUser
} = require('../controllers/OrderController')


// router.get('/order', getOrderAPI);
router.post('/order', postCreateOrder);
router.get("/order/:id_user", getOrdersByUser);


module.exports = router;