const express = require('express')
const router = express.Router()

const controllerAdmin = require('./../controller/ControllerAdmin')

router.get('/', controllerAdmin.home)
router.get('/admin', controllerAdmin.sign_in)
router.get('/admin/sign-in', controllerAdmin.sign_in)
    // router.get('/admin/dashboard', controllerAdmin.dashboard)
router.get('/admin/city-level', controllerAdmin.city_level)
router.get('/admin/update-city-level', controllerAdmin.update_city_level)
router.get('/admin/health-declaretion', controllerAdmin.health_declaretion)
router.get('/privacy', controllerAdmin.privacy)
router.get('/admin/print-pcr', controllerAdmin.print_pcr)
router.get('/admin/search-profile', controllerAdmin.search_profile)

module.exports = router