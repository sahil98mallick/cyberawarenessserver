const mongoose = require('mongoose')

const SubscribedSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    createdAt: String,
})


module.exports = mongoose.model('SubscribedSchema', SubscribedSchema)
