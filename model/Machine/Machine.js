const mongoose = require('mongoose')
const validator = require('./../../helper/validator')

const object = mongoose.Schema({
    name: {
        ...validator.schemaString,
        ...validator.schemaRequired,
        ...validator.schemaAutoIndex,
    },
    code: {
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
    },
    place: {
        ...validator.schemaString,
    },
    status: {
        ...validator.schemaNumber,
    },
    history: {
        ...validator.schemaJson,
    },
}, { timestamps: true })

module.exports = mongoose.model('Machine', object)