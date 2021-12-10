const information = require('../api/ControllerCity/Information')

const CityModel = require('../model/City/City')
const validator = require('../helper/validator')

exports.createControllerCity = function createControllerCity(app) {
    information(app)
}