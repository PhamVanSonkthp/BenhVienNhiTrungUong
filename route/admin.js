const express = require('express')
const router = express.Router()

const controllerAdmin = require('./../controller/ControllerAdmin')

router.get('/admin/sign-in', controllerAdmin.sign_in)
router.get('/admin/dashboard', controllerAdmin.dashboard)
router.get('/admin/city-level', controllerAdmin.city_level)

module.exports = router