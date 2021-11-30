const mongoose = require('mongoose')
const validator = require('./../../helper/validator')

const object = mongoose.Schema({
    token:{
        ...validator.schemaString,
        ...validator.schemaAutoIndex,
    },
},{timestamps: true});

module.exports = mongoose.model('Token' , object);