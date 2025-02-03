const express = require('express');
const router = express.Router();
const Restaurant = require('./models/restaurant'); // get our mongoose model


router.get('/by-user/:user_id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ user_id: req.params.user_id }).exec();

        if (!restaurant) {
            return res.status(404).json({ error: 'No restaurant found for this user' });
        }

        res.status(200).json({
            self: '/api/v1/restaurants/' + restaurant._id,
            user_id: restaurant.user_id,
            email: restaurant.email,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            rating: restaurant.rating,
            price: restaurant.price,
            opening_hours: restaurant.opening_hours,
            opening_days: restaurant.opening_days,
            dishes: restaurant.dishes,
            profile_url: restaurant.profile_url
        });

    } catch (error) {
        console.error('Error fetching restaurants by user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        // https://mongoosejs.com/docs/api.html#model_Model.findById
        let restaurant = await Restaurant.findById(req.params.id).exec();
        if (!restaurant) {
            res.status(404).send()
            console.log('restaurant not found')
            return;
        }

        res.status(200).json({
            self: '/api/v1/restaurants/' + restaurant._id,
            user_id: restaurant.user_id,
            email: restaurant.email,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            rating: restaurant.rating,
            price: restaurant.price,
            opening_hours: restaurant.opening_hours,
            opening_days: restaurant.opening_days,
            dishes: restaurant.dishes,
            profile_url: restaurant.profile_url
        });
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('', async (req, res) => {
    try {
        const categories = req.query.categories; // querry parametr

        let restaurants;
        if (categories) {
            restaurants = await Restaurant.find({ category: { $in: categories } });
        } else {
            // If no category/ies, return all restaurants
            restaurants = await Restaurant.find({});
        }

        restaurants = restaurants.map((restaurant) => {
            return {
                self: '/api/v1/restaurants/' + restaurant._id,
                user_id: restaurant.user_id,
                email: restaurant.email,
                name: restaurant.name,
                address: restaurant.address,
                category: restaurant.category,
                rating: restaurant.rating,
                price: restaurant.price,
                opening_hours: restaurant.opening_hours,
                opening_days: restaurant.opening_days,
                dishes: restaurant.dishes,
                profile_url: restaurant.profile_url
            };
        });

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        // Check if all required fields are completed 
        const requiredFields = ['user_id', 'email', 'name', 'address', 'category', 'price', 'opening_hours', 'opening_days', 'profile_url'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({  error: `Missing required field: ${field}` });
            }
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        let restaurant = new Restaurant({
            user_id: req.body.user_id,
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            category: req.body.category,
            rating: req.body.rating || 0, 
            price: req.body.price,
            opening_hours: req.body.opening_hours,
            opening_days: req.body.opening_days,
            dishes: req.body.dishes || [], 
            profile_url: req.body.profile_url
        });

        restaurant = await restaurant.save();

        const responseData = {
            id: restaurant._id.toString(),
            self: '/api/v1/restaurants/${restaurant._id}',
            user_id: restaurant.user_id,
            email: restaurant.email,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category,
            rating: restaurant.rating,
            price: restaurant.price,
            opening_hours: restaurant.opening_hours,
            opening_days: restaurant.opening_days,
            dishes: restaurant.dishes,
            profile_url: restaurant.profile_url
        };

        console.log('restaurant saved successfully');
        console.log('/api/v1/restaurants/' + restaurant._id);
        res.location(responseData.self)
            .status(201)
            .json(responseData);
    } catch (error) {
        console.error('Error saving restaurant:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    let restaurant = await Restaurant.findById(req.params.id).exec();;
    if (!restaurant) {
        res.status(404).send()
        console.log('restaurant not found')
        return;
    }
    await restaurant.deleteOne();
    console.log('restaurant removed')
    res.status(204).send()
});

router.put('/:id', async (req, res) => {
    try {
        let restaurant = await Restaurant.findById(req.params.id).exec();
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        // Check if all required fields are completed 
        const requiredFields = ['user_id', 'email', 'name', 'address', 'category',
            'price', 'opening_hours', 'opening_days', 'profile_url'];
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

        const updatableFields = [
            'email', 'name', 'address', 'category', 'price',
            'opening_hours', 'opening_days', 'profile_url'
        ];

        updatableFields.forEach(field => {
            restaurant[field] = req.body[field];
        });

        // warns when the updated rating is out of range
        if (req.body.rating !== undefined) {
            if (typeof req.body.rating !== 'number' || req.body.rating < 0 || req.body.rating > 5) {
                return res.status(400).json({ error: 'Rating must be a number between 0-5' });
            }
            restaurant.rating = req.body.rating;
        }

        // warns when the dishes value is not a usefull value
        if (req.body.dishes !== undefined) {
            if (!Array.isArray(req.body.dishes)) {
                return res.status(400).json({ error: 'Dishes must be an array' });
            }
            restaurant.dishes = req.body.dishes;
        }
        

        const updatedRestaurant = await restaurant.save();

        const responseData = {
            self: '/api/v1/restaurants/${updatedRestaurant._id}',
            user_id: updatedRestaurant.user_id,
            email: updatedRestaurant.email,
            name: updatedRestaurant.name,
            address: updatedRestaurant.address,
            category: updatedRestaurant.category,
            rating: updatedRestaurant.rating,
            price: updatedRestaurant.price,
            opening_hours: updatedRestaurant.opening_hours,
            opening_days: updatedRestaurant.opening_days,
            dishes: updatedRestaurant.dishes,
            profile_url: updatedRestaurant.profile_url
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error('Error updating restaurant:', error);

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