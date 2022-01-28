const express = require('express')
const router = express.Router()

const controllerProfile = require('./../controller/ControllerProfile')

router.get('/profile/:objectId', controllerProfile.profile)


module.exports = router