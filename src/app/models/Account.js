const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Account = new Schema({
    username: { type: String, unique: true },
    password: { type: String },
    email: { type: String },
    name: { type: String },
    role: { type: String, required: true },
    phone: { type: String },
    identity: { type: String },
    address: { type: String },
    credit: {type: Number},
});

module.exports = mongoose.model('Account', Account);