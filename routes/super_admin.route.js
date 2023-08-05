var router = require('express').Router()

/**
 * =====================================================================
 * * SUPER ADMIN ROUTES
 * =====================================================================
 */

// % ======================================================================
// % Admin Powers Controller - ito yung add, edit, delete ng mga user types
// % natin like Add Admin, Add Student, Add PUP Staff, etc...
// % ======================================================================
var adminPowersController = require('../controllers/super_admin/admin_power.controller')
// >> Super Admin
router.get('/admin', adminPowersController.viewAllSuperAdmin)
router.get('/admin/:user_id', adminPowersController.viewSpecificSuperAdmin)
router.post('/admin/add', adminPowersController.enrollSuperAdmin)
router.put('/admin/edit/:user_id', adminPowersController.editSuperAdmin)
router.delete('/admin/deactivate/:user_id', adminPowersController.deactivateSuperAdmin)

// >> Student
router.get('/student', adminPowersController.viewAllStudent)
router.get('/student/:user_id', adminPowersController.viewSpecificStudent)
router.post('/student/add', adminPowersController.enrollStudent)
router.put('/student/edit/:user_id', adminPowersController.editStudent)
router.delete('/student/deactivate/:user_id', adminPowersController.deactivateStudent)

// >> PUP Staff
router.get('/pup_staff', adminPowersController.viewAllPUPStaff)
router.get('/pup_staff/:user_id', adminPowersController.viewSpecificPUPStaff)
router.post('/pup_staff/add', adminPowersController.enrollStaff)
router.put('/pup_staff/edit/:user_id', adminPowersController.editStaff)
router.delete('/pup_staff/deactivate/:user_id', adminPowersController.deactivateStaff)

// % ======================================================================
// % Info Controller - information related to the currently logged in user
// % ======================================================================
var infoController = require('../controllers/super_admin/info.controller')
router.get('/info', infoController.getInfo)
router.put('/info', infoController.updateInfo)
router.put('/info/change_password', infoController.changePassword)

// % ======================================================================
// % Analytics Controller - information related to admin dashboard.
// % ======================================================================
var analyticsController = require('../controllers/super_admin/analytics.controller')
router.get('/analytics/user_count', analyticsController.getUsersCount)
router.get('/analytics/user_role_count', analyticsController.getUsersRoleCount)
router.get('/analytics/user_blacklist_count', analyticsController.getUsersBlacklistCount)
router.get('/analytics/user_region_count', analyticsController.getUsersRegionCount)
router.get('/analytics/announcement_count', analyticsController.getAnnouncementCount)
router.get('/analytics/all_system_count', analyticsController.getAllSystemCount)
router.get(
    '/analytics/three_year_appointment_count',
    analyticsController.getThreeYearAppointmentCount
)
router.get('/analytics/three_year_request_count', analyticsController.getThreeYearRequestCount)
router.get(
    '/analytics/three_year_reservation_count',
    analyticsController.getThreeYearReservationCount
)
router.get('/analytics/three_year_all_system_count', analyticsController.getThreeYearAllSystemCount)

// % ======================================================================
// % Role Controller - information related to the roles of the users.
// % (example: PUP Staff [Dentist, Doctor, etc...] or Student [Organizer])
// % ======================================================================
var roleController = require('../controllers/super_admin/role.controller')
router.get('/role', roleController.viewAllRoles)
router.get('/role/:role_id', roleController.viewSpecificRole)
router.get('/role/user_type/:role_for', roleController.viewRolesBasedOnRoleFor)
router.post('/role/add', roleController.addRole)
router.put('/role/status/:role_id', roleController.changeRoleStatus)
router.delete('/role/delete/:role_id', roleController.deleteRole)
// % User Role <-> Role Relationship
var userRoleController = require('../controllers/super_admin/user_role.controller')
router.get('/user_role/all/:user_type', userRoleController.viewAllUsersRoles)
router.get('/user_role/:user_id', userRoleController.viewSpecificUsersRoles)
router.get('/all_roles/:user_id', userRoleController.getAllRoles)
router.get('/users_without_roles/:user_type', userRoleController.viewUsersWithoutRoles)
router.post('/user_role/:user_id', userRoleController.assignRoleToUser)
router.delete('/user_role/:user_id', userRoleController.removeRoleFromUser)

// % ======================================================================
// % Holiday Controller - information related to holidays.
// % ======================================================================
var holidayController = require('../controllers/super_admin/holiday.controller')
router.get('/holiday', holidayController.viewAllHolidays)
router.get('/holiday/:holiday_id', holidayController.viewSpecificHoliday)
router.get('/holiday/year/:year', holidayController.viewHolidaysBasedOnYear)
router.post('/holiday/add', holidayController.addHoliday)
router.put('/holiday/edit/:holiday_id', holidayController.editHoliday)
router.put('/holiday/status/:holiday_id', holidayController.changeHolidayStatus)
router.delete('/holiday/delete/:holiday_id', holidayController.deleteHoliday)

// % ======================================================================
// % Organization Controller - information related to Organization.
// % ======================================================================
var organizationController = require('../controllers/super_admin/organization.controller')
router.get('/organization', organizationController.viewAllOrganization)
router.get('/organization/:organization_id', organizationController.viewSpecificOrganization)
router.post('/organization/add_organization', organizationController.addOrganization)
router.put(
    '/organization/edit_organization/:organization_id',
    organizationController.editOrganization
)
router.put(
    '/organization/deactivate/:organization_id',
    organizationController.deactivateOrganization
)
router.delete('/organization/delete/:organization_id', organizationController.deleteOrganization)

// % ======================================================================
// % Education Profile Controller - information related to Education Profile.
// % ======================================================================

var educationProfileController = require('../controllers/super_admin/education_profile.controller')
router.get('/education_profile/:user_id', educationProfileController.viewEducationProfile)
router.post('/education_profile/:user_id', educationProfileController.createEducationProfile)
router.put('/education_profile/:user_id', educationProfileController.updateEducationProfile)

// * Export Module to use in ../index.js
module.exports = router
