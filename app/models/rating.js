const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Rating', new Schema({
    restaurant_id: { type: String, required: true },
    user_id: { type: String, required: true},
    rating: {type: Number, required: true, min: 0, max: 5 },}
));