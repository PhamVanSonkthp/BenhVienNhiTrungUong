const information = require('../api/ControllerMachine/Information')

exports.createControllerMachine = function createControllerMachine(app) {
    information(app)
}