const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MaterialESchema = new Schema({
    name: {type: String, maxlength: 255},
    quantity: {type: Number},
	description: {type: String, maxlength: 600},
	image: {type: String},
    slug: {type: String},
    status: {type: String},
    file: {type: String},
    category: {type: String},
})

module.exports = mongoose.model('Material_e', MaterialESchema)