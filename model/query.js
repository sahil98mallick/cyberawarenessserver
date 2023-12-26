const mongoose = require('mongoose')

const querySchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    creatorname: String,
    creatorid: String,
    querydetails: String,
    status: Boolean,
    createdAt: String,
})


module.exports = mongoose.model('QuerySchema', querySchema)
