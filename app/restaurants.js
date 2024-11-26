const express = require('express');
const router = express.Router();
const Restaurant = require('./models/restaurant'); // get our mongoose model




router.get('', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.find
    let restaurants = await Restaurant.find({});
    restaurants = restaurants.map((restaurant) => {
        return {
            self: '/api/v1/resturants/' + restaurant.id,
            email: restaurant.email,
            name: restaurant.name,
            address: restaurant.address,
            category: restaurant.category

        };
    });
    res.status(200).json(restaurants);
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
        self: '/api/v1/resturants/' + restaurant.id,
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

    let restaurant = new Restaurant({
            email: req.body.email,
            name:  req.body.name,
            address:  req.body.address,
            category:  req.body.category
    });

    restaurant = await restaurant.save();

    let restaurantId = restaurant.id;

    console.log('restaurant saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/restaurants/" + restaurantId).status(201).send();
});


module.exports = router;