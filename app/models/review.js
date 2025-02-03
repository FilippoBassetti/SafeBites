const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Review', new Schema({
    restaurant_id: { type: String, required: true },
    user_id: { type: String, required: true},
    text: {type: string, required: true}
}));