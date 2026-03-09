const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        enum: ['video', 'audio'],
        default: 'video'
    },
    location: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
