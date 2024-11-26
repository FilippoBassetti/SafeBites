const express = require('express');
const router = express.Router();
const Restaurant = require('./models/restaurant'); // get our mongoose model


router.get('', async (req, res) => {
    try {
        const category = req.query.category; // querry parametr

        let restaurants;
        if (category) {
            // If category, return restaurants by cat
            restaurants = await Restaurant.find({ category: category });
        } else {
            // If no category, return all restaurants
            restaurants = await Restaurant.find({});
        }

        restaurants = restaurants.map((restaurant) => {
            return {
                self: '/api/v1/restaurants/' + restaurant._id,
                email: restaurant.email,
                name: restaurant.name,
                address: restaurant.address,
                category: restaurant.category
            };
        });

        res.status(200).json(restaurants);
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.use('/:id', async (req, res, next) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let restaurant = await Restaurant.findById(req.params.id).exec();
    if (!restaurant) {
        res.status(404).send()
        console.log('book not found')
        return;
    }
    req['restaurant'] = restaurant;
    next()
});

router.get('/:id', async (req, res) => {
    let restaurant = req['restaurant'];
    res.status(200).json({
        self: '/api/v1/restaurants/' + restaurant._id,
        email: restaurant.email,
        name: restaurant.name,
        address: restaurant.address,
        category: restaurant.category
    });
});

router.delete('/:id', async (req, res) => {
    let restaurant = req['restaurant'];
    await Restaurant.deleteOne({ _id: req.params.id });
    console.log('restaurant removed')
    res.status(204).send()
});

router.post('', async (req, res) => {
    console.log('Received POST request with body:', req.body);
    try {
        let restaurant = new Restaurant({
            email: req.body.email,
            name: req.body.name,
            address: req.body.address,
            category: req.body.category
        });

        restaurant = await restaurant.save();

        let restaurantId = restaurant._id;

        console.log('restaurant saved successfully');
        console.log('/api/v1/restaurants/' + restaurantId);
        res.location('/api/v1/restaurants/' + restaurantId).status(201).send();
    } catch (error) {
        console.error('Error saving restaurant:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});


module.exports = router;