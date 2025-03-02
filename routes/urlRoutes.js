const express = require('express');
const {generateShortUrl, redirectToLongUrl} = require("../controllers/urlControllers");

const router = express.Router();

// Generate short url route ...
router.post('/generate', generateShortUrl);

// Redirect to long url route ...
router.get('/redirect/:shortUrl([a-zA-Z0-9_-]+)', redirectToLongUrl);

module.exports = router;