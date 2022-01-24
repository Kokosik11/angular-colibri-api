const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Document = new Schema({
    title: {
        type: String,
        required: true
    },
    documentURL: {
        type: String,
        required: true
    },
    prevURL: {
        type: String,
        required: true
    },
    documentIconURL: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Document', Document);  