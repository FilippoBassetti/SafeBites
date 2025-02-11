const express = require('express');
const router = express.Router();
const Review = require('../models/review');

// Get reviews for a restaurant, optionally filtered by user
router.get('/:restaurant_id', async (req, res) => {
    try {
        let reviews;
        // Check for user_id query parameter
        if (req.query.user_id) {
            reviews = await Review.find({ 
                restaurant_id: req.params.restaurant_id, 
                user_id: req.query.user_id 
            });
        } else {
            reviews = await Review.find({ restaurant_id: req.params.restaurant_id });
        }

        // Handle no results case
        if (reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found...' });
        }

        // Format response to exclude database internals
        reviews = reviews.map(review => ({
            restaurant_id: review.restaurant_id,
            user_id: review.user_id,
            text: review.text
        }));

        res.status(200).json({ reviews });

    } catch (error) {
        console.error('Error fetching reviews by resturant (and/or user):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create new review
router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        // Validate required field
        console.log("pre validation");
        const requiredFields = ['restaurant_id', 'user_id', 'text'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        console.log( "post review"  + req.body.restaurant_id +  req.body.user_id );
        console.log(Review.findOne({ restaurant_id: req.body.restaurant_id, user_id: req.body.user_id }) )

        if (Review.findOne({ restaurant_id: req.body.restaurant_id, user_id: req.body.user_id }) null) {
                    return res.status(400).json({ error: 'the user already reviewed this restaurant, want to edit -> PUT' });
        }

        // Create and save new review
        let review = new Review({
            restaurant_id: req.body.restaurant_id,
            user_id: req.body.user_id,
            text: req.body.text
        });
        
        review = await review.save();

        // Build response with location header
        const responseData = {
            self: '/api/v1/review/' + review._id,
            restaurant_id: review.restaurant_id,
            user_id: review.user_id,
            text: review.text
        };

        console.log('Review saved successfully');
        res.location(responseData.self)
            .status(201)
            .json(responseData);
    } catch (error) {
        console.error('Error saving review:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

// Update existing review
router.put('/:restaurant_id', async (req, res) => {
    try {
        // Validate required query parameter
        if (!req.query.user_id) {
            return res.status(400).json({ error: `Missing required user_id query parameter` });
        }

        // Find existing review
        let review = await Review.findOne({ 
            restaurant_id: req.params.restaurant_id, 
            user_id: req.query.user_id 
        });
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Validate required text field
        const requiredFields = ['text'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        // Verify ID consistency
        if (req.body.restaurant_id !== req.params.restaurant_id) {
            return res.status(400).json({ error: "restaurant_id mismatch" });
        }
        if (req.body.user_id !== req.query.user_id) {
            return res.status(400).json({ error: "user_id mismatch" });
        }

        // Update and save review
        review.text = req.body.text;
        review = await review.save();

        // Build response
        const responseData = {
            self: '/api/v1/review/' + review._id,
            restaurant_id: review.restaurant_id,
            user_id: review.user_id,
            text: review.text
        };

        console.log('Review saved successfully');
        res.location(responseData.self)
            .status(200)
            .json(responseData);
    } catch (error) {
        console.error("Error updating review:", error);

        // Handle specific database errors
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete review
router.delete('/:restaurant_id', async (req, res) => {
    try {
        // Validate required query parameter
        if (!req.query.user_id) {
            return res.status(400).json({ error: `Missing required user_id query parameter` });
        }
        
        // Find and verify review exists
        let review = await Review.findOne({ 
            restaurant_id: req.params.restaurant_id, 
            user_id: req.query.user_id 
        });
        
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Delete review
        await Review.deleteOne({ 
            restaurant_id: req.params.restaurant_id, 
            user_id: req.query.user_id 
        });
        console.log('review removed')
        res.status(204).send()
    } catch (error) {
        console.error('Error deleting review:', error);

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