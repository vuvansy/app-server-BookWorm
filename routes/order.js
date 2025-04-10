var express = require('express');
var router = express.Router();

const {
    postCreateOrder, getOrdersByUser, getOrderDetailById,
    updateOrderStatus, updateOrderPaymentStatus, getOrdersAPI, getOrderById
} = require('../controllers/OrderController')


router.get('/order', getOrdersAPI);
router.post('/order', postCreateOrder);
router.post("/order/detail", getOrderById);
router.post("/order/update-payment-status", updateOrderPaymentStatus);
router.get("/order/:id_user", getOrdersByUser);
router.get("/order-id/:id_order", getOrderDetailById);
router.put("/order/update-status/:id_order", updateOrderStatus);

module.exports = router;