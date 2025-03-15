var express = require('express');
var router = express.Router();

const {
    postCreateCoupon, getCouponAPI, getCouponById, applyCoupon,
    updateCouponAPI, deleteCouponAPI

} = require('../controllers/CouponController')


router.get('/coupon', getCouponAPI);
router.post('/coupon', postCreateCoupon);
router.post('/coupon/apply', applyCoupon);
router.put("/coupon/:id", updateCouponAPI);
router.delete("/coupon/:id", deleteCouponAPI);
router.get('/coupon/:id', getCouponById);


module.exports = router;