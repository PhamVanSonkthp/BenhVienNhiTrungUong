const authorization = require('../api/ControllerAdmin/Authorization')

const AdminModel = require('../model/Admin/Admin')
const validator = require('../helper/validator')

exports.createControllerAdmin = function createControllerAdmin(app) {
    authorization(app)
}

exports.sign_in = async function(req, res) {
    res.render('admin/sign-in')
}

exports.dashboard = async function(req, res) {
    res.render('admin/dashboard')
}

exports.city_level = async function(req, res) {
    res.render('admin/city-level')
}