const mongoose = require('mongoose')
const validator = require('./../../helper/validator')

const object = mongoose.Schema({
    barcode: {
        ...validator.schemaString,
    },
    identity: {
        ...validator.schemaString,
    },
    note: {
        ...validator.schemaString,
    },
    gender: {
        ...validator.schemaString,
    },
    name: {
        ...validator.schemaString,
    },
    result: {
        ...validator.schemaString,
    },
    type: {
        ...validator.schemaString,
    },
    type_object: {
        ...validator.schemaString,
    },
    number_testing: {
        ...validator.schemaString,
    },
    code_form: {
        ...validator.schemaString,
    },
    date_collection: {
        ...validator.schemaString,
    },
    date_testing: {
        ...validator.schemaString,
    },
    date_of_birth: {
        ...validator.schemaString,
    },
    method_testing: {
        ...validator.schemaString,
    },
    district: {
        ...validator.schemaString,
    },
    no: {
        ...validator.schemaString,
    },
    phone: {
        ...validator.schemaString,
    },
    city: {
        ...validator.schemaString,
    },
    sub_district: {
        ...validator.schemaString,
    },
    address: {
        ...validator.schemaString,
    },
    id: {
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
    },
}, { timestamps: true })

module.exports = mongoose.model('Profile', object)