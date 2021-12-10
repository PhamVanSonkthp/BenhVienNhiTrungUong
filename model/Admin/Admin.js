const mongoose = require('mongoose')
const validator = require('./../../helper/validator')

const object = mongoose.Schema({
    user_name: {
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
        ...validator.schemaUnique,
    },
    password: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
}, { timestamps: true })

module.exports = mongoose.model('Admin', object)