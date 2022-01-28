const information = require('../api/ControllerProfile/Information')

const ProfileModel = require('./../model/Profile/Profile')

exports.createControllerProfile = function createControllerProfile(app) {
    information(app)
}

exports.profile = async function(req, res) {
    try {
        const object = await ProfileModel.findOne({ id: req.params.objectId })
        res.render('profile', { object: object })
    } catch (err) {
        res.render('profile')
    }
}