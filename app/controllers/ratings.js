const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');

// Get ratings for a restaurant, optionally filtered by user
router.get('/:restaurant_id', async (req, res) => {
    try {
        let ratings;
        // Check for user_id query parameter
        if (req.query.user_id) {
            ratings = await Rating.find({
                restaurant_id: req.params.restaurant_id,
                user_id: req.query.user_id
            });
        } else {
            ratings = await Rating.find({ restaurant_id: req.params.restaurant_id });
        }

        // Handle no results case
        if (ratings.length === 0) {
            return res.status(404).json({ error: 'No ratings found...' });
        }

        // Format response to exclude database internals
        ratings = ratings.map(rating => ({
            restaurant_id: rating.restaurant_id,
            user_id: rating.user_id,
            rating: rating.rating
        }));

        res.status(200).json({ ratings });

    } catch (error) {
        console.error('Error fetching ratings by restaurant (and/or user):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new rating
router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        // Validate required fields
        const requiredFields = ['restaurant_id', 'user_id', 'rating'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Validate rating range
        if (req.body.rating < 0 || req.body.rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 0 and 5' });
        }

        if (await Rating.findOne({ restaurant_id: req.body.restaurant_id, user_id: req.body.user_id })) {
            return res.status(400).json({ error: 'the user already rated this restaurant, want to edit -> PUT' });
        }

        // Create and save new rating
        let rating = new Rating({
            restaurant_id: req.body.restaurant_id,
            user_id: req.body.user_id,
            rating: req.body.rating
        });

        rating = await rating.save();

        // Build response with location header
        const responseData = {
            self: '/api/v1/rating/' + rating._id,
            restaurant_id: rating.restaurant_id,
            user_id: rating.user_id,
            rating: rating.rating
        };

        console.log('Rating saved successfully');
        res.location(responseData.self)
            .status(201)
            .json(responseData);
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Update existing rating
router.put('/:restaurant_id', async (req, res) => {
    try {
        // Validate required query parameter
        if (!req.query.user_id) {
            return res.status(400).json({ error: 'Missing required user_id query parameter' });
        }

        // Find existing rating
        let rating = await Rating.findOne({
            restaurant_id: req.params.restaurant_id,
            user_id: req.query.user_id
        });

        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        // Validate required fields
        const requiredFields = ['rating'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Validate rating range
        if (req.body.rating < 0 || req.body.rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 0 and 5' });
        }

        // Verify ID consistency
        if (req.body.restaurant_id !== req.params.restaurant_id) {
            return res.status(400).json({ error: 'restaurant_id mismatch' });
        }
        if (req.body.user_id !== req.query.user_id) {
            return res.status(400).json({ error: 'user_id mismatch' });
        }

        // Update and save rating
        rating.rating = req.body.rating;
        rating = await rating.save();

        // Build response
        const responseData = {
            self: '/api/v1/rating/' + rating._id,
            restaurant_id: rating.restaurant_id,
            user_id: rating.user_id,
            rating: rating.rating
        };

        console.log('Rating updated successfully');
        res.location(responseData.self)
            .status(200)
            .json(responseData);
    } catch (error) {
        console.error('Error updating rating:', error);

        // Handle specific database errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid ID format' });
        }

        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete rating
router.delete('/:restaurant_id', async (req, res) => {
    try {
        // Validate required query parameter
        if (!req.query.user_id) {
            return res.status(400).json({ error: 'Missing required user_id query parameter' });
        }

        // Find and verify rating exists
        let rating = await Rating.findOne({
            restaurant_id: req.params.restaurant_id,
            user_id: req.query.user_id
        });

        if (!rating) {
            return res.status(404).json({ error: 'Rating not found' });
        }

        // Delete rating
        await Rating.deleteOne({
            restaurant_id: req.params.restaurant_id,
            user_id: req.query.user_id
        });
        console.log('Rating removed');
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting rating:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

module.exports = router;