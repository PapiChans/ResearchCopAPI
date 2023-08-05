var router = require('express').Router()

/**
 * =====================================================================
 * * HOME ROUTES - WITH AUTHORIZATION
 * =====================================================================
 */

// % Login Controller
var loginController = require('../controllers/home/login.controller')
router.post('/login', loginController.login)
router.post('/loginToAdmin', loginController.loginToAdmin)

var resetPasswordController = require('../controllers/home/reset_password.controller')
router.post('/reset-password-request', resetPasswordController.resetPasswordLink)
router.get('/verify-reset-password/:token', resetPasswordController.verifyResetPassword)
router.post('/reset-password', resetPasswordController.resetPassword)

var contactController = require('../controllers/home/contact.controller')
router.post('/get-in-touch', contactController.getInTouch)

var annsysController = require('../controllers/home/annsys.controller')
router.get('/news', annsysController.getTenNews)
router.get('/news/:reference_id', annsysController.getSpecificNews)
router.get('/advisory', annsysController.getTenAdvisory)
router.get('/advisory/:reference_id', annsysController.getSpecificAdvisory)

var recaptchaController = require('../controllers/home/recaptcha.controller')
router.post('/verify-recaptcha', recaptchaController.verifyRecaptcha)

// * Export Module to use in ../index.js
module.exports = router
