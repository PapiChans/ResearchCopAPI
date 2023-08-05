var router = require('express').Router()

/**
 * =====================================================================
 * * STUDENT ROUTES
 * =====================================================================
 */

// % ======================================================================
// % Info Controller - information related to the currently logged in user
// % ======================================================================
var infoController = require('../controllers/student/info.controller')
router.get('/info', infoController.getInfo)
router.patch('/info', infoController.updateInfo)
router.put('/info/change_password', infoController.changePassword)
router.get('/educ_profile', infoController.getEducProfile)
router.put('/educ_profile', infoController.updateEducProfile)

// % ======================================================================
// % Holiday Controller - information related to holidays.
// % ======================================================================
var holidayController = require('../controllers/student/holiday.controller')
router.get('/holidays', holidayController.getHolidaysForThisMonth)

// % ======================================================================
// % DPA Agreement Controller - information related to DPA Agreement.
// % ======================================================================
var dpaAgreementController = require('../controllers/student/dpa_agreement.controller')
router.get('/view/dpa_agreement', dpaAgreementController.getDPA)
router.post('/submit/dpa_agreement', dpaAgreementController.signDPA)

// * Export Module to use in ../index.js
module.exports = router
