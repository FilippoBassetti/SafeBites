const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    user_name: { type: String, required: true , unique: true},
    name: { type: String, required: true },
    family_name: { type: String, required: true },
    favourite_list: {type: [String], required: true },
    user_type: { type: Boolean, required: true },
}));