const express = require('express');
const {generateShortUrl, redirectToLongUrl} = require("../controllers/urlControllers");

const router = express.Router();

// Generate short url route ...
router.post('/generate', generateShortUrl);

// Redirect to long url route ...
router.get('/:shortUrl', redirectToLongUrl);

module.exports = router;