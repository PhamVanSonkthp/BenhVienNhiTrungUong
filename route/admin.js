const express = require('express')
const router = express.Router()

const controllerAdmin = require('./../controller/ControllerAdmin')

router.get('/', controllerAdmin.home)
router.get('/admin', controllerAdmin.sign_in)
router.get('/admin/sign-in', controllerAdmin.sign_in)
    // router.get('/admin/dashboard', controllerAdmin.dashboard)
router.get('/admin/city-level', controllerAdmin.city_level)
router.get('/admin/update-city-level', controllerAdmin.update_city_level)
router.get('/privacy', controllerAdmin.privacy)
router.get('/term-of-uses', controllerAdmin.term_of_uses)

module.exports = router