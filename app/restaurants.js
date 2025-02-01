const express = require('express');
const router = express.Router();
const Restaurant = require('./models/restaurant'); // get our mongoose model


router.get('/by-user/:user_id', async (req, res) => {
    try {
        const restaurants = await Restaurant.find({ user_id: req.params.user_id }).exec();

        if (!restaurants || restaurants.length === 0) {
            return res.status(404).json({ error: 'No restaurants found for this user' });
        }

        // Map the response for consistency
        const response = restaurants.map((restaurant) => ({
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
        }));

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching restaurants by user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req, res) => {
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
});


router.get('', async (req, res) => {
    try {
        const categories = req.query.categories; // querry parametr

        let restaurants;
        if (categories) {
            // Parse the categories into an array (if it's a string, split by comma)
            const categoryArray = Array.isArray(categories) ? categories : categories.split(',');
            // Find restaurants where the category array contains at least one of the specified categories
            restaurants = await Restaurant.find({ category: { $in: categoryArray } });
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
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }

        let restaurant = new Restaurant({
            user_id: req.body.user_id, 
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            category: req.body.category,
            rating: req.body.rating || 0, // Default to 0 if not provided
            price: req.body.price,
            opening_hours: req.body.opening_hours,
            opening_days: req.body.opening_days,
            dishes: req.body.dishes || [], // Default to empty array
            profile_url: req.body.profile_url // Default to empty string
        });

        // Save to database
        restaurant = await restaurant.save();

        // Prepare response data
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
    let restaurant = await Booklending.findById(req.params.id).exec();;
    if (!restaurant) {
        res.status(404).send()
        console.log('restaurant not found')
        return;
    }
    await restaurant.deleteOne();
    console.log('restaurant removed')
    res.status(204).send()
});

router.put('/:id', async(req, res) => {
    let restaurant = 
    await Restaurant.findByIdAndUpdate({ _id: req.params.id });
    console.log('restaurant removed')
    res.status(204).send()  
})


module.exports = router;