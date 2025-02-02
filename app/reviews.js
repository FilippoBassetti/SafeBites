const express = require('express');
const router = express.Router();
const Review = require('./models/review'); // get our mongoose model


router.get('/:rest_id', async (req, res) => {
    try {
        let reviews;
        if (req.query.user_id) {
            reviews = await Review.find({ rest_id: req.params.rest_id, user_id: req.query.user_id }).exec();
        } else {
            // If no category/ies, return all restaurants
            reviews = await Review.find({ rest_id: req.params.rest_id });
        }

        if (reviews.length === 0) {
            return res.status(404).json({ error: 'No reviews found...' });
        }

        reviews = reviews.map(review => ({
            rest_id: review.rest_id,
            user_id: review.user_id,
            text: review.text
        }));

        res.status(200).json({ reviews });

    } catch (error) {
        console.error('Error fetching reviews by resturant (and/or user):', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        const requiredFields = ['rest_id', 'user_id', 'text'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        let review = new Review({
            rest_id: req.body.rest_id,
            user_id: req.body.user_id,
            text: req.body.text
        });


        review = await review.save();

        const responseData = {
            self: '/api/v1/review/' + review._id,
            rest_id: review.rest_id,
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

router.put('/:rest_id', async (req, res) => {
    try {
        if (!req.query.user_id) {
            return res.status(400).json({ error: `Missing required user_id query parameter` });
        }

        let review = await Review.findOne({ rest_id: req.params.rest_id, user_id: req.query.user_id }).exec();
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        const requiredFields = ['text'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        if (req.body.rest_id !== req.params.rest_id) {
            return res.status(400).json({ error: "rest_id mismatch" });
        }
        if (req.body.user_id !== req.query.user_id) {
            return res.status(400).json({ error: "user_id mismatch" });
        }


        review.text = req.body.text;
        review = await review.save();

        const responseData = {
            self: '/api/v1/review/' + review._id,
            rest_id: review.rest_id,
            user_id: review.user_id,
            text: review.text
        };

        console.log('Review saved successfully');
        res.location(responseData.self)
            .status(200)
            .json(responseData);
    } catch (error) {
        console.error("Error updating review:", error);

        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        if (error.name === "CastError") {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete('/:rest_id', async (req, res) => {
    try {
        if (!req.query.user_id) {
            return res.status(400).json({ error: `Missing required user_id query parameter` });
        }
        let review = await Review.findOne({ rest_id: req.params.rest_id, user_id: req.query.user_id }).exec();
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }
        await review.deleteOne();
        console.log('review removed')
        res.status(204).send()
    }
    catch (error) {
        console.error('Error deleting review:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
});
