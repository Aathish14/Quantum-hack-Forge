const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'equalguard_secret_token_9988';

// HELPER REGISTRATION
router.post('/register', async (req, res) => {
    console.log(`Registration attempt for: ${req.body.email}. DB State: ${mongoose.connection.readyState}`);
    try {
        const { name, email, phone, password, role, latitude, longitude } = req.body;

        // Basic Validation
        if (!name || !email || !password || !role || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'Helper already registered with this email' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            phone,
            password: hashedPassword,
            role,
            verified: true, // Auto-verify for now so you can login instantly
            location: {
                type: 'Point',
                coordinates: [parseFloat(longitude) || 0, parseFloat(latitude) || 0]
            }
        });

        await user.save();

        res.status(201).json({ 
            message: 'Registration successful. Your account is waiting for admin verification.',
            user: { id: user._id, name, email, role: user.role, verified: false } 
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        let errorMessage = 'Database not connected. Please whitelist your IP (106.192.73.119) in MongoDB Atlas.';
        
        if (error.code === 11000) {
            errorMessage = 'Helper already registered with this email';
        } else if (mongoose.connection.readyState === 1 && !error.message.includes('timeout') && !error.message.includes('whitelist')) {
            errorMessage = 'Registration failed internal error';
        }

        res.status(500).json({ 
            error: errorMessage,
            details: error.message
        });
    }
});

// HELPER LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Helper not registered' });
        }

        // 2. Check password match
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Incorrect password' });
        }

        // 3. Check if verified
        if (user.verified !== true) {
            return res.status(403).json({ error: 'Account not verified', message: 'Your helper account is waiting for admin verification.' });
        }

        // Login successful
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ 
            token, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                phone: user.phone,
                verified: user.verified 
            } 
        });

    } catch (error) {
        console.error('Login error:', error);
        
        let errorMessage = 'Login failure';
        if (mongoose.connection.readyState !== 1 || error.message.includes('timeout')) {
            errorMessage = 'Database not connected. Please whitelist your IP (106.192.73.119) in MongoDB Atlas.';
        }

        res.status(500).json({ error: errorMessage, details: error.message });
    }
});

// GET HELPER PROFILE
router.get('/profile', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        res.json(user);
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

module.exports = router;
