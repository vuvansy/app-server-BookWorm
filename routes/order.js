var express = require('express');
var router = express.Router();

const {
    postCreateOrder, getOrdersByUser, getOrderDetailById
} = require('../controllers/OrderController')


// router.get('/order', getOrderAPI);
router.post('/order', postCreateOrder);
router.get("/order/:id_user", getOrdersByUser);
router.get("/order-id/:id_order", getOrderDetailById);

module.exports = router;