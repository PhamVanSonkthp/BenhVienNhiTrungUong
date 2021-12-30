const express = require('express')
const router = express.Router()

const controllerProfile = require('./../controller/ControllerProfile')

router.get('/profile/:objectId', controllerProfile.profile)
router.get('/profile-mobile/:objectId', controllerProfile.profile_mobile)


module.exports = router