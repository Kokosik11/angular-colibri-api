const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Faq = new Schema({
    quest: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Faq', Faq);  