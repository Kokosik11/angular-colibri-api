const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bid = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

module.exports = mongoose.model('Bid', Bid);  