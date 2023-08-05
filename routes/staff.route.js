var router = require('express').Router()

/**
 * =====================================================================
 * * PUP STAFF ROUTES
 * =====================================================================
 */

// % ======================================================================
// % Info Controller - information related to the currently logged in user
// % ======================================================================
var infoController = require('../controllers/staff/info.controller')
router.get('/info', infoController.getInfo)
router.put('/info', infoController.updateInfo)
router.put('/info/change_password', infoController.changePassword)

// % ======================================================================
// % Verification Controller - information related to verification.
// % ======================================================================
var verificationController = require('../controllers/staff/verification.controller')
router.post('/verification', verificationController.generateCode)

// * Export Module to use in ../index.js
module.exports = router
