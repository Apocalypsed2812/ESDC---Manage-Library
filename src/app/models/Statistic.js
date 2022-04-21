const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Statistic = new Schema({
    bookb: { type: Number },
    bookd: { type: Number },
    bookl: { type: Number },
});

module.exports = mongoose.model('Statistic', Statistic);