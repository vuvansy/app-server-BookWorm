var express = require('express');
var router = express.Router();

const { postCreateBanner, getBannerAPI, putUpdateBanner, deleteBanner
 } = require('../controllers/BannerController')


router.get('/banner', getBannerAPI);
router.post('/banner', postCreateBanner);
router.put('/banner/:id', putUpdateBanner);
router.delete('/banner/:id', deleteBanner);

module.exports = router;