const mongoose = require('mongoose');
const urlModel = require('../models/urlModel');

const memoryStore = new Map();
let memoryIdCounter = 0;

const idString = (id) => {
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let shortCode = "";

    while (id > 0) {
        shortCode = chars[id % chars.length] + shortCode;
        id = Math.floor(id / chars.length);
    }

    while (shortCode.length < 8) {
        shortCode = chars[Math.floor(Math.random() * chars.length)] + shortCode;
    }

    return shortCode;
};

const validateLongUrl = (value) => {
    if (typeof value !== 'string') {
        return null;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return null;
    }

    try {
        const parsed = new URL(trimmedValue);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return null;
        }
        return parsed.toString();
    } catch (error) {
        return null;
    }
};

const getBaseUrl = (request) => {
    if (process.env.APP_ENV === 'production') {
        return process.env.BASE_URL || process.env.DEV_BASE_URL || `${request.protocol}://${request.get('host')}`;
    }

    return process.env.DEV_BASE_URL || `${request.protocol}://${request.get('host')}`;
};

const isDatabaseReady = () => mongoose.connection.readyState === 1;

const createUniqueShortCode = async (fallbackId) => {
    let newId = fallbackId;
    let shortCode = idString(newId);

    while (await shortCodeExists(shortCode)) {
        newId += 1;
        shortCode = idString(newId);
    }

    return { newId, shortCode };
};

const shortCodeExists = async (shortCode) => {
    if (isDatabaseReady()) {
        const existing = await urlModel.findOne({ short_url: shortCode });
        return Boolean(existing);
    }

    return memoryStore.has(shortCode);
};

const saveUrlEntry = async (entry) => {
    if (isDatabaseReady()) {
        const newUrl = new urlModel(entry);
        await newUrl.save();
        return;
    }

    memoryStore.set(entry.short_url, entry);
};

const loadUrlEntry = async (shortCode) => {
    if (isDatabaseReady()) {
        return urlModel.findOne({ short_url: shortCode });
    }

    return memoryStore.get(shortCode) || null;
};

exports.generateShortUrl = async (request, response) => {
    const { longUrl } = request.body;
    const normalizedUrl = validateLongUrl(longUrl);

    if (!normalizedUrl) {
        return response.status(400).json({
            type: 'error',
            message: 'Please enter a valid http or https URL.'
        });
    }

    try {
        let newId = 1;

        if (isDatabaseReady()) {
            const lastEntry = await urlModel.findOne().sort({ id: -1 });
            newId = lastEntry ? lastEntry.id + 1 : 1;
        } else {
            newId = memoryIdCounter + 1;
        }

        const { shortCode } = await createUniqueShortCode(newId);
        const insertedAt = new Date();
        const entry = {
            id: newId,
            short_url: shortCode,
            long_url: normalizedUrl,
            inserted_at: insertedAt
        };

        await saveUrlEntry(entry);

        if (!isDatabaseReady()) {
            memoryIdCounter = newId;
        }

        const baseUrl = getBaseUrl(request).replace(/\/$/, '');
        const shortUrl = `${baseUrl}/${shortCode}`;

        response.status(201).json({
            type: 'success',
            message: 'Short URL generated successfully!',
            data: {
                shortUrl,
                longUrl: normalizedUrl,
                redirectUrl: shortUrl,
                insertedAt
            }
        });
    } catch (err) {
        console.log(err);
        response.status(500).json({
            type: 'error',
            message: 'Internal Server Error!'
        });
    }
};

exports.redirectToLongUrl = async (request, response) => {
    const shortUrl = request.params.shortUrl;

    try {
        const urlEntry = await loadUrlEntry(shortUrl);

        if (!urlEntry) {
            return response.status(404).json({
                type: 'error',
                message: 'URL not found!'
            });
        }

        response.status(301).redirect(urlEntry.long_url);
    } catch (err) {
        console.log(err);
        response.status(500).json({
            type: 'error',
            message: 'Internal Server Error!'
        });
    }
};
