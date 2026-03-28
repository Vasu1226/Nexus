const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { users } = require('../data/store');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password (In real app, use bcrypt)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Return jsonwebtoken
        const payload = {
            user: {
                id: user.id,
                name: user.name,
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: payload.user });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
