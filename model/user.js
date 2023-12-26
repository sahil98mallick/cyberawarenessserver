const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: String,
    phone: String,
    password: String,
    activestatus: Boolean,
    createdAt: String,
    address: String
})


module.exports = mongoose.model('UserSchema', userSchema)
