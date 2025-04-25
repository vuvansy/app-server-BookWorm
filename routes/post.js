var express = require('express');
var router = express.Router();

const { getPostAPI,postCreatePost, putUpdatePostAPI, getPostByIdAPI
 } = require('../controllers/PostController')


router.get('/post', getPostAPI);
router.post('/post', postCreatePost);
router.put('/post/:id', putUpdatePostAPI);
router.get('/post/:id', getPostByIdAPI);

module.exports = router;