const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    message: String,
    createdAt: String,
})


module.exports = mongoose.model('ContactSchema', contactSchema)
