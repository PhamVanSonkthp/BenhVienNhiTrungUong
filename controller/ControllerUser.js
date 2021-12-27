const authorization = require('../api/ControllerUser/Authorization')

exports.createControllerUser = function createControllerUser(app) {
    authorization(app)
}