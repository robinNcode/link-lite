const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },
        short_url: { type: String, unique: true, required: true },
        long_url: { type: String, required: true },
        inserted_at: { type: Date, default: Date.now }
    }
);

module.exports = mongoose.model('url', urlSchema);