const mongoose = require('mongoose');

const sosEventSchema = new mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    video_url: { type: String, default: '' },
    audio_url: { type: String, default: '' },
    image_url: { type: String, default: '' },
    status: { 
        type: String, 
        enum: ['active', 'resolved'], 
        default: 'active' 
    },
    triggered_by: { type: String, default: 'anonymous_user' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [lon, lat]
    }
});

// Index for geo-spatial radius search
sosEventSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('SOS_Event', sosEventSchema);
