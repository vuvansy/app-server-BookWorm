var express = require('express');
var router = express.Router();

const { getUsersAPI
} = require('../controllers/UserController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({
      data: 'hello world first apis'
  })
});

router.get('/user', getUsersAPI);

module.exports = router;
