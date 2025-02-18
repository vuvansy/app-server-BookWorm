var express = require('express');
var router = express.Router();

const { getGenreAPI, postCreateGenre, putUpdateGenre, deleteAGenre
 } = require('../controllers/GenreController')


router.get('/genre', getGenreAPI);
router.post('/genre', postCreateGenre);
router.put('/genre/:id', putUpdateGenre);
router.delete('/genre/:id', deleteAGenre);

module.exports = router;