var express = require('express');
var router = express.Router();

const { 
    getStatsAPI
 } = require('../controllers/StatsController')


router.get('/stats', getStatsAPI);


module.exports = router;