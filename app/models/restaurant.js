const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Restaurant', new Schema({
    user_id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: [String], required: true }, // Array of strings
    rating: { type: Number, required: true, min: 0, max: 5 },
    price: { type: Number, required: true, min: 1, max: 4 }, // [0-10, 10-20, 20-40, 40-60, 60-100, 100+]
    opening_hours: {
        type: [[Number]], // Array of arrays of numbers
        validate: {
            validator: function (v) {
                return v.every(arr => arr.length === 2); // Ensure each array has 2 numbers
            },
            message: 'Each opening hours array must have exactly 2 numbers',
        },
        required: true,
    },
    opening_days: {
        type: [Number],
        validate: {
            validator: function (v) {
                return v.length === 7; // Ensure that there are exactly 7 days
            },
            message: 'Opening days array must contain 7 items',
        },
        required: true,
    },
    dishes: {
        type: [{
            name: { type: String, required: true },
            url: { type: String, required: true }
        }],
        required: true
    }, // Array of dishes, composed of a name and a foto for each dish
    profile_url: { type: String, required: true }, // URL for the restaurant profile pictur
    certificate: {type: Boolean, required: true, default: false} // AIC certificate
}));

//const Restaurant = require('./models/restaurant');