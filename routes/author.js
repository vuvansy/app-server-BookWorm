var express = require('express');
var router = express.Router();

const { getAuthorAPI, postCreateAuthor, updateAuthorAPI,
    deleteAuthorAPI
} = require('../controllers/AuthorController')


router.get('/author', getAuthorAPI);
router.post('/author', postCreateAuthor);
router.put('/author/:id', updateAuthorAPI);
router.delete("/author/:id", deleteAuthorAPI);


module.exports = router;