const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
    {
        id: {type: Number, unique: true, required:true},
        short_url : {type: String, unique: true, required:true},
        long_url : {type: String, required:true},
    }
);

module.exports = mongoose.model('url', urlSchema);