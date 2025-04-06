var express = require('express');
var router = express.Router();

const { getUsersAPI, postCreateUserAPI, updateUserAPI, blockUserAPI, deleteUser,
  postCreateArrayUser, getUserByIdAPI
} = require('../controllers/UserController')


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.status(200).json({
    data: 'hello world first apis'
  })
});

router.get('/user', getUsersAPI);
router.post('/user', postCreateUserAPI);
router.post('/user-many', postCreateArrayUser);
router.put("/user/:id", updateUserAPI);
router.patch("/user/:id", blockUserAPI);
router.delete('/user/:id', deleteUser);

router.get("/user/:id", getUserByIdAPI);

module.exports = router;
