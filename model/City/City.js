const mongoose = require('mongoose');
const validator = require('./../../helper/validator')

const CityChema = new mongoose.Schema({
    city: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    slug_city: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    district: {
        ...validator.schemaString,
        ...validator.schemaRequired,
    },
    slug_district: {
        ...validator.schemaString,
    },
    sub_district: {
        ...validator.schemaString,
    },
    slug_sub_district: {
        ...validator.schemaString,
    },
    slug_all: {
        ...validator.schemaString,
    },
    level: {
        ...validator.schemaNumber,
        ...validator.schemaRequired,
    },
}, { timestamps: true })

mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('City', CityChema)