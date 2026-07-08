const express = require('express');
const { generateShortUrl, redirectToLongUrl } = require('../controllers/urlControllers');

const router = express.Router();

router.post('/generate', generateShortUrl);
router.get('/redirect/:shortUrl([a-zA-Z0-9_-]+)', redirectToLongUrl);
router.get('/:shortUrl([a-zA-Z0-9_-]+)', redirectToLongUrl);

module.exports = router;