var express = require('express');
var router = express.Router();

const {
    getStatsAPI, getRevenueStatsAPI, getUserStatsAPI,
    getOrderStatsAPI, getLowStockBooksAPI
} = require('../controllers/StatsController')


router.get('/stats', getStatsAPI);
router.get("/stats/revenue", getRevenueStatsAPI);
router.get("/stats/users", getUserStatsAPI);
router.get("/stats/orders", getOrderStatsAPI);
router.get("/books/low-stock", getLowStockBooksAPI);


module.exports = router;