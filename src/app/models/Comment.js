const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
    username: { type: String },
    comment: { type: String },
    avatar: { type: String },
});

module.exports = mongoose.model('Comment', Comment);