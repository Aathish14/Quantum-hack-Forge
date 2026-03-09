const express = require('express');
const router = express.Router();
const SOS_Event = require('../models/SOS_Event');
const User = require('../models/User');

// GET all users (Managers)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// GET all helpers/responders (specifically for verification)
router.get('/helpers', async (req, res) => {
    try {
        // Find users who are NOT regular users if we have that distinction, 
        // but currently all roles except 'Admin' are responders.
        const helpers = await User.find({ role: { $ne: 'Admin' } }).select('-password').sort({ createdAt: -1 });
        res.json(helpers);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch helpers' });
    }
});

// GET all incidents
router.get('/events', async (req, res) => {
    try {
        const events = await SOS_Event.find().sort({ timestamp: -1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch SOS events' });
    }
});

// GET all evidence (flattened list of media from all events)
router.get('/evidence', async (req, res) => {
    try {
        const events = await SOS_Event.find({ 
            $or: [
                { video_url: { $ne: '' } },
                { image_url: { $ne: '' } },
                { audio_url: { $ne: '' } }
            ]
        }).sort({ timestamp: -1 });
        
        const evidence = events.map(e => ({
            _id: e._id,
            timestamp: e.timestamp,
            location: { latitude: e.latitude, longitude: e.longitude },
            video_url: e.video_url,
            image_url: e.image_url,
            audio_url: e.audio_url,
            triggered_by: e.triggered_by
        }));
        
        res.json(evidence);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch evidence' });
    }
});

// VERIFY helper
router.patch('/helpers/:id/verify', async (req, res) => {
    try {
        const { verified } = req.body;
        const helper = await User.findByIdAndUpdate(req.params.id, { verified }, { new: true });
        res.json({ message: `Helper ${verified ? 'Verified' : 'Suspended'}`, helper });
    } catch (err) {
        res.status(500).json({ error: 'Verification update failed' });
    }
});

// DELETE user
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// DELETE incident/event
router.delete('/events/:id', async (req, res) => {
    try {
        await SOS_Event.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Incident deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete incident' });
    }
});

module.exports = router;
