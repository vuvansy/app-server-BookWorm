var express = require('express');
var router = express.Router();

const { getDeliveryAPI, postCreateDelivery
 } = require('../controllers/DeliveryController')


router.get('/delivery', getDeliveryAPI);
router.post('/delivery', postCreateDelivery);


module.exports = router;