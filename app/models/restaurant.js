const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Restaurant', new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
    
}));

//const Restaurant = require('./models/restaurant');