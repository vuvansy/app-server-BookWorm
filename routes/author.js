var express = require('express');
var router = express.Router();

const { getAuthorAPI, postCreateAuthor,
 } = require('../controllers/AuthorController')


router.get('/author', getAuthorAPI);
router.post('/author', postCreateAuthor);


module.exports = router;