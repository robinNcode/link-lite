const urlModel = require('../models/urlModel');

// Converting id to 8characters string
const idString = (id) => id.toString(36).padStart(8, "0");

/**
 * Generating short url ...
 */
exports.generateShortUrl = async (request, response) => {
    const { longUrl } = request.body;
    console.log(request);

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

        const newUrl = new urlModel({
            id: newId,
            short_url: shortUrl,
            long_url: longUrl
        });

        await newUrl.save();

        response.status(201).json({
            type: 'success',
            message: 'Short URL generated successfully!',
            data: newUrl
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
    const { shortUrl } = request.params;

    try {
        const urlEntry = await urlModel.findOne({short_url});

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
