const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookSchema = new Schema({
    name: {type: String, maxlength: 255},
    quantity: {type: Number},
	description: {type: String, maxlength: 600},
	image: {type: String},
    slug: {type: String},
    status: {type: String},
})

module.exports = mongoose.model('Book', BookSchema)