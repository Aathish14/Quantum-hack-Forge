const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

const SOS_Event = require('./models/SOS_Event');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
    // Only build indexes if connection is established
    if (mongoose.connection.readyState === 1) {
        console.log("Indexes sync initiated...");
        User.createIndexes().catch(err => console.log("User Index Error:", err.message));
        SOS_Event.createIndexes().catch(err => console.log("SOS Index Error:", err.message));
    }
});

// Cloudinary Setup
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer Memory Storage (More reliable for mixed media)
const upload = multer({ storage: multer.memoryStorage() });

// --- AUTHENTICATION ---
app.use('/api/auth', require('./routes/auth'));

// --- ADMIN FEATURES ---
app.use('/api/admin', require('./routes/admin'));

// ALIAS for STEP 4: user requested POST /api/uploadEvidence
app.post('/api/uploadEvidence', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), async (req, res) => {
    console.log('--- Incoming Upload Request ---');
    console.log('Files received:', Object.keys(req.files || {}));
    if (req.files['video']) console.log('Video found:', req.files['video'][0].originalname);
    return handleSOSCapture(req, res);
});

// Original SOS API logic extracted for reuse
const handleSOSCapture = async (req, res) => {
    try {
        const { latitude, longitude, triggeredBy } = req.body;
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lon)) {
            return res.status(400).json({ error: 'Valid GPS coordinates required' });
        }

        // Helper to upload buffer to Cloudinary
        const uploadToCloudinary = (fileBuffer, resourceType) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'equalguard_evidence', resource_type: resourceType },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(fileBuffer);
            });
        };

        const video_url = req.files['video'] ? await uploadToCloudinary(req.files['video'][0].buffer, 'video') : '';
        const image_url = req.files['image'] ? await uploadToCloudinary(req.files['image'][0].buffer, 'image') : '';
        const audio_url = req.files['audio'] ? await uploadToCloudinary(req.files['audio'][0].buffer, 'video') : ''; // Audio is often resource_type: 'video' in Atlas/Cloudinary terminology

        const newEvent = new SOS_Event({
            latitude: lat,
            longitude: lon,
            video_url,
            audio_url,
            image_url,
            triggered_by: triggeredBy || 'anonymous_user',
            location: {
                type: 'Point',
                coordinates: [lon, lat]
            }
        });

        await newEvent.save();

        // STEP 5: Helper Radius Detection (6km)
        const nearbyHelpers = await User.find({
            verified: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lon, lat]
                    },
                    $maxDistance: 6000 // 6 KM
                }
            }
        });

        console.log(`[ALERT] SOS Event ${newEvent._id} triggered. Position: [${lat}, ${lon}].`);
        console.log(`[ALERT] Found ${nearbyHelpers.length} verified helpers within 6km.`);
        if (nearbyHelpers.length > 0) {
            nearbyHelpers.forEach(h => console.log(`  -> Notified: ${h.name} (${h.role})`));
        }
        
        res.status(201).json({
            success: true,
            message: 'Evidence uploaded successfully',
            event: newEvent,
            video_url,
            nearby_helpers_count: nearbyHelpers.length,
            google_maps_link: `https://www.google.com/maps?q=${lat},${lon}`
        });
    } catch (error) {
        console.error('Upload Failed:', error);
        res.status(500).json({ error: 'Critical failure during evidence upload', details: error.message });
    }
};

app.post('/api/sos/uploadEvidence', upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), handleSOSCapture);

// --- HELPER LOGIC ---
app.post('/api/helpers/update-location', async (req, res) => {
    try {
        const { userId, latitude, longitude } = req.body;
        if (!userId || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await User.findByIdAndUpdate(userId, {
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            }
        });

        res.json({ success: true, message: 'Location updated' });
    } catch (err) {
        res.status(500).json({ error: 'Location update failed' });
    }
});

// --- NEARBY ALERTS FOR RESPONDERS ---
app.get('/api/nearby-alerts', async (req, res) => {
    try {
        const { lat, lon, radius = 6000 } = req.query;
        console.log(`[QUERY] Fetching alerts for: ${lat}, ${lon} (Radius: ${radius}m)`);
        
        if (!lat || !lon) {
            return res.status(400).json({ error: 'GPS coordinates required' });
        }

        let alerts = await SOS_Event.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lon), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            }
        }).sort({ timestamp: -1 }).limit(10);

        // HACKATHON FALLBACK: If no nearby alerts, show any alert from the last 10 minutes
        if (alerts.length === 0) {
            console.log(`[QUERY] No nearby matches. Falling back to global active feed.`);
            alerts = await SOS_Event.find({
                status: 'active',
                timestamp: { $gt: new Date(Date.now() - 10 * 60 * 1000) } // Last 10 mins
            }).sort({ timestamp: -1 }).limit(5);
        }

        console.log(`[QUERY] Found ${alerts.length} matches.`);
        res.json(alerts);
    } catch (err) {
        console.error("Alerts Fetch Error:", err);
        res.status(500).json({ error: 'Failed to fetch nearby alerts' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'EqualGuard Server Online', 
        db: mongoose.connection.readyState === 1 ? 'OK' : 'Disconnected' 
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`EqualGuard Senior Server active on port ${PORT}`);
});
