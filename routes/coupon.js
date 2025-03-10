var express = require('express');
var router = express.Router();

const {
    postCreateCoupon, getCouponAPI, getCouponById, applyCoupon

} = require('../controllers/CouponController')


router.get('/coupon', getCouponAPI);
router.post('/coupon', postCreateCoupon);
router.post('/coupon/apply', applyCoupon);
router.get('/coupon/:id', getCouponById);


module.exports = router;