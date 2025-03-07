var express = require('express');
var router = express.Router();

const {
    postCreateCoupon,getCouponAPI

} = require('../controllers/CouponController')


router.get('/coupon', getCouponAPI);
router.post('/coupon', postCreateCoupon);


module.exports = router;