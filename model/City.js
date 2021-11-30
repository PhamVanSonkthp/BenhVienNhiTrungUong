const mongoose = require('mongoose');
const validator = require('./../helper/validator')

const CityChema = new mongoose.Schema({
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
    level: {
        ...validator.schemaNumber,
        ...validator.schemaRequired,
    },
}, { timestamps: true })

mongoose.set('useCreateIndex', true)
module.exports = mongoose.model('City', CityChema)