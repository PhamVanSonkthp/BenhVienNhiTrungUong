const mongoose = require('mongoose')
const validator = require('./../../helper/validator')

const object = mongoose.Schema({
    name: {
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
        ...validator.schemaRequired,
    },
    phone: {
        ...validator.schemaString,
    },
    gender: {
        ...validator.schemaString,
    },
    national: {
        ...validator.schemaString,
    },
    birth_of_day: {
        ...validator.schemaDatetime,
    },
    identity: {
        ...validator.schemaString,
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
    details: {
        ...validator.schemaString,
    },
    mores: {
        ...validator.schemaJson,
    },
}, { timestamps: true })

object.index({ "createdAt": 1 })

module.exports = mongoose.model('HealthDeclaretion', object)