const authorization = require('../api/ControllerUser/Authorization')

exports.createControllerUser = function createControllerUser(app) {
    authorization(app)
}

exports.search = async function(req, res) {
    res.render('tra-cuu')
}