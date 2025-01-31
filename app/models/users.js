const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    user_name: { type: String, required: true },
    name: { type: String, required: true },
    family_name: { type: String, required: true },
    user_type: { type: Boolean, required: true },
}));