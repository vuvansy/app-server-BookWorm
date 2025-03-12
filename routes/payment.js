var express = require('express');
var router = express.Router();

const { 
    getPaymentAPI, postCreatePayment
 } = require('../controllers/PaymentController')


router.get('/payment', getPaymentAPI);
router.post('/payment', postCreatePayment);


module.exports = router;