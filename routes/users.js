var express = require('express');
var router = express.Router();

const { getUsersAPI, postCreateUserAPI
} = require('../controllers/UserController')
const upload = require('../middleware/multerConfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({
      data: 'hello world first apis'
  })
});

router.get('/user', getUsersAPI);
router.post('/user',upload.single('image'), postCreateUserAPI);

module.exports = router;
