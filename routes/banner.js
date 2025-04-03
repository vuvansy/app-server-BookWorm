var express = require('express');
var router = express.Router();

const { postCreateBanner, getBannerAPI
 } = require('../controllers/BannerController')


router.get('/banner', getBannerAPI);
router.post('/banner', postCreateBanner);
// router.put('/genre/:id', putUpdateGenre);
// router.delete('/genre/:id', deleteAGenre);

module.exports = router;