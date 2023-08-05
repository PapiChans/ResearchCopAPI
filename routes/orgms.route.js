var router = require('express').Router()
const { organizationLogoUpload } = require('../helpers/imageMiddleware')

/**
 * =====================================================================
 * * ORGMS ROUTES
 * =====================================================================
 */

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================
var organizationAdminController = require('../controllers/super_admin/orgms/organization.controller')
router.get(
    '/super_admin/view/registered_organization',
    organizationAdminController.viewRegisteredOrganizations
)

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================

// % Organization Controllers
var organizationController = require('../controllers/student/orgms/organization.controller')
router.post(
    '/student/add/organization',
    organizationLogoUpload.any(),
    organizationController.addOrganization
)
router.get('/student/view/registration', organizationController.viewOrganization)
router.get('/student/view/student_no_organizer', organizationController.viewStudentNoOrganizerStaff)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS (Doctor, Dentist, Guidance Counsellor)
// >> ======================================================================
var organizationStaffController = require('../controllers/staff/orgms/organization.controller')
router.get(
    '/pup_staff/view/organization/:organization_id',
    organizationStaffController.viewSpecificOrganization
)
router.get(
    '/pup_staff/view/all_organization/:organization_status',
    organizationStaffController.viewOrganization
)
router.put(
    '/pup_staff/status/organization/:organization_id',
    organizationStaffController.changeStatusOrganization
)
router.delete(
    '/pup_staff/delete/organization/:organization_id',
    organizationStaffController.deleteOrganization
)

// * Export Module to use in ../index.js
module.exports = router
