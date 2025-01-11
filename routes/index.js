var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({
    "statusCode": 200,
    "message": "Dự Án Tốt Nghiệp PRO2201.04",
    "data": {
      "author": "Website BookWorm",
      "data": "Hello World",
     
    },
    "author": "syvvps26357@fpt.edu.vn"
  });
});

module.exports = router;
