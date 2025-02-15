var express = require('express');
var router = express.Router();

const { getGenreAPI, postCreateGenre
 } = require('../controllers/GenreController')


router.get('/genre', getGenreAPI);
router.post('/genre', postCreateGenre);


module.exports = router;