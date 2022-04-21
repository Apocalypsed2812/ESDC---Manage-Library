const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Loan = new Schema({
    name: { type: String },
    book: { type: String },
    username: { type: String },
    staff: { type: String },
    dateb: { type: String},
    dater: { type: String },
    quantity: { type: Number },
    status: { type: String },
});

module.exports = mongoose.model('Loan', Loan);