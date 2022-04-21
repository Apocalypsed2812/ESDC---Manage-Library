const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Staff = new Schema({
    username: { type: String, unique: true},
    password: { type: String },
    email: { type: String },
    name: { type: String },
    identity: { type: String },
    phone: { type: String },
    sex: { type: String },
    date: { type: String },
    address: { type: String },
});

module.exports = mongoose.model('Staff', Staff);