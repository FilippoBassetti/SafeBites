const express = require('express');
const router = express.Router();
const User = require('./models/users'); // get our mongoose model

// Get user by ID

router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id).exec();
        if (!user) {
            console.log('User not found');
            return res.status(404).send();
        }
        res.status(200).json({
            self: '/api/v1/users/' + user._id,
            email: user.email,
            user_name: user.user_name,
            name: user.name,
            family_name: user.family_name,
            user_type: user.user_type
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a new user
router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        const requiredFields = ['email', 'password', 'user_name', 'name', 'family_name', 'user_type'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        let user = new User({
            email: req.body.email,
            password: req.body.password,
            user_name: req.body.user_name,
            name: req.body.name,
            family_name: req.body.family_name,
            user_type: req.body.user_type
        });

        user = await user.save();

        const responseData = {
            id: user._id.toString(),
            self: `/api/v1/users/${user._id}`,
            email: user.email,
            user_name: user.user_name,
            name: user.name,
            family_name: user.family_name,
            user_type: user.user_type
        };

        console.log('User saved successfully');
        res.location(responseData.self)
           .status(201)
           .json(responseData);
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

module.exports = router;