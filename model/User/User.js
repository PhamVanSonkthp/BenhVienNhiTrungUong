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
    name: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    place: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    identity: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    date_of_birth: {
        ...validator.schemaDatetime,
        ...validator.schemaRequired,
    },
    national: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    city: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    district: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    sub_district: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    detail: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    phone: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
}, { timestamps: true })

module.exports = mongoose.model('User', object)