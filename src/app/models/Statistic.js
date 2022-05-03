const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Statistic = new Schema({
    month: {type: String},
    year: {type: String},
    bookb: { type: Number },
    bookd: { type: Number },
    bookl: { type: Number },
    bookn: { type: Number },
});

module.exports = mongoose.model('Statistic', Statistic);