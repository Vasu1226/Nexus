const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { dashboardData, submissions } = require('../data/store');

// @route   GET /api/dashboard-data
// @desc    Get mock dashboard data
// @access  Private
router.get('/dashboard-data', authMiddleware, (req, res) => {
    try {
        // In a real app, you would fetch this from a DB based on req.user.id

        // Using setTimeout to simulate network delay for skeleton loaders
        setTimeout(() => {
            res.json(dashboardData);
        }, 1000);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/contact', (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const newSubmission = {
            id: Date.now().toString(),
            name,
            email,
            message,
            date: new Date()
        };

        submissions.push(newSubmission);

        // Emit notification via WebSocket
        const io = req.app.get('io');
        io.emit('notification', {
            type: 'contact',
            message: `New message from ${name}`,
            timestamp: new Date()
        });

        // Simulate network delay to show loading state
        setTimeout(() => {
            res.status(200).json({ message: 'Message sent successfully!', submission: newSubmission });
        }, 800);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
