var express = require('express');
var router = express.Router();

const { getGenreAPI, postCreateGenre, putUpdateGenre
 } = require('../controllers/GenreController')


router.get('/genre', getGenreAPI);
router.post('/genre', postCreateGenre);
router.put('/genre/:id', putUpdateGenre);

module.exports = router;