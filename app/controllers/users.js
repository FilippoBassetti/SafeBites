const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/user'); // get our mongoose model

// Get user by ID

router.get('/me', async (req, res) => {
    try {
        if (!req.loggedUser) {
            return;
        }

        let user = await User.findById(req.loggedUser.id);
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
            favourite_list: user.favourite_list,
            user_type: user.user_type
            
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
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
            favourite_list: user.favourite_list,
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
        const requiredFields = ['email', 'password', 'user_name', 'name', 'family_name'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        let user = new User({
            email: req.body.email,
            password: hashedPassword,
            user_name: req.body.user_name,
            name: req.body.name,
            family_name: req.body.family_name,
            favourite_list: req.body.favourite_list || {},
            user_type: req.body.user_type || false
        });

        user = await user.save();

        const responseData = {
            id: user._id,
            self: `/api/v1/users/${user._id}`,
            email: user.email,
            user_name: user.user_name,
            name: user.name,
            family_name: user.family_name,
            favourite_list: user.favourite_list,
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

// Update user 
router.put('/:{id}', async (req, res) => {
    console.log('Received PUT request with body:', req.body);
    try {
        // find user
        let user = await User.findById(req.params.id);
        if (!user) {
            console.log('User not found');
            return res.status(404).send();
        }

        //check body and sanitize input
        const requiredFields = ['email', 'password', 'user_name', 'name', 'family_name'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        if(await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ error: 'Password MUST be different from the previus one' });
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }



        const updatableFields = [
            'email', 'password', 'user_name', 'name', 'family_name', 'favourite_list', 'user_type'
        ];

        updatableFields.forEach(field => {
            user[field] = req.body[field];
        });

        const updatedUser = await user.save();

        const responseData = {
            id: updatedUser._id,
            self: `/api/v1/users/${updatedUser._id}`,
            email: updatedUser.email,
            user_name: updatedUser.user_name,
            name: updatedUser.name,
            family_name: updatedUser.family_name,
            favourite_list: updatedUser.favourite_list,
            user_type: updatedUser.user_type
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


router.delete('/:id', async (req, res) => {
    let user = req['user'];
    await User.deleteOne({ _id: req.params.id });
    console.log('user removed')
    res.status(204).send()
});

module.exports = router;