const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Restaurant', new Schema({
    id: { type: Number, required: true, unique: true }, // Custom unique identifier
    email: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true }, // Fixed typo: `adress` to `address`
    category: { type: String, required: true }
}));

//const Restaurant = require('./models/restaurant');