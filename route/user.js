const express = require('express')
const router = express.Router()

const controllerUser = require('./../controller/ControllerUser')

router.get('/tra-cuu', controllerUser.search)

module.exports = router