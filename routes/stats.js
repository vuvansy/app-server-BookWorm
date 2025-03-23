var express = require('express');
var router = express.Router();

const { 
    getStatsAPI, getRevenueStatsAPI
 } = require('../controllers/StatsController')


router.get('/stats', getStatsAPI);
router.get("/stats/revenue", getRevenueStatsAPI);

module.exports = router;