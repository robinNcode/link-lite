const urlModel = require('../models/urlModel');

// Converting id to 8characters string
const idString = (id) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let shortUrl = "";

    while (id > 0) {
        shortUrl = chars[id % chars.length] + shortUrl;
        id = Math.floor(id / chars.length);
    }

    // Ensure it's exactly 8 characters by adding random characters if it's too short
    while (shortUrl.length < 8) {
        shortUrl = chars[Math.floor(Math.random() * chars.length)] + shortUrl;
    }

    return shortUrl;
};


/**
 * Generating short url ...
 */
exports.generateShortUrl = async (request, response) => {
    const BASE_URL = process.env.APP_ENV === 'production' ? process.env.BASE_URL : process.env.DEV_BASE_URL;
    const { longUrl } = request.body;


    if (!longUrl) {
        return response.status(400).json({
            type: 'error',
            message: 'URL cannot be empty!'
        });
    }

    try{
        const lastEntry = await urlModel.findOne().sort({id: -1});
        const newId = lastEntry ? lastEntry.id + 1 : 1;
        const shortUrl = idString(newId);
        // get current time and date for UTC +6 Dhaka, Bangladesh
        let insertedAt = new Date().toLocaleString('en-US', {timeZone: 'Asia/Dhaka'});
        insertedAt = new Date(insertedAt);

        const newUrl = new urlModel({
            id: newId,
            short_url: shortUrl,
            long_url: longUrl,
            inserted_at: insertedAt
        });

        await newUrl.save();

        response.status(201).json({
            type: 'success',
            message: 'Short URL generated successfully!',
            data: {
                shortUrl: shortUrl,
                longUrl: longUrl,
                redirectUrl: BASE_URL +  '/api/url/redirect',
                insertedAt: insertedAt
            }
        });
    }
    catch(err){
        console.log(err);
        response.status(500).json({
            type: 'error',
            message: 'Internal Server Error!'
        });
    }
};

/**
 * Redirect to long url from short url
 */
exports.redirectToLongUrl = async (request, response) => {
    const  shortUrl = request.params.shortUrl;

    console.log(shortUrl);
    try {
        const urlEntry = await urlModel.findOne({short_url: shortUrl});

        if (!urlEntry) {
            return response.status(404).json({
                type: 'error',
                message: 'URL not found!'
            });
        }

        response.status(301).redirect(urlEntry.long_url);
    }
    catch(err){
        console.log(err);
        response.status(500).json({
            type: 'error',
            message: 'Internal Server Error!'
        });
    }
}
