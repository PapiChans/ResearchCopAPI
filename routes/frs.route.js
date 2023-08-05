var router = require('express').Router()
const { facilityPictureUpload } = require('../helpers/imageMiddleware')

/**
 * =====================================================================
 * * FRS ROUTES
 * =====================================================================
 */

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================
// % Facility Controllers
var facilityController = require('../controllers/super_admin/frs/facility.controller')
router.get('/super_admin/view_facility', facilityController.viewAllFacility)
router.get(
    '/super_admin/view_specific_facility/:facility_id',
    facilityController.viewSpecificFacilityAdmin
)
router.post(
    '/super_admin/add_facility',
    facilityPictureUpload.any(),
    facilityController.addFacility
)
router.put('/super_admin/edit_facility/:facility_id', facilityController.editFacilityAdmin)
router.delete('/super_admin/deactivate/:facility_id', facilityController.deactivateFacility)
router.delete('/super_admin/delete/:facility_id', facilityController.deleteFacility)

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================
// % Facility Reservation Controllers
var facilityReservationStudentController = require('../controllers/student/frs/facility_reservation.controller')

router.post(
    '/student/add/facility_reservation',
    facilityReservationStudentController.reserveFacility
)
router.get(
    '/student/view/facility_reservation',
    facilityReservationStudentController.viewAllFacilityReservation
)
router.get(
    '/student/view/facility_reservation/:facility_reservation_id',
    facilityReservationStudentController.viewSpecificFacilityReservation
)
router.put(
    '/student/edit/facility_reservation/:facility_reservation_id',
    facilityReservationStudentController.editFacilityReservation
)
router.delete(
    '/student/cancel/facility_reservation/:facility_reservation_id',
    facilityReservationStudentController.cancelFacilityReservation
)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS (Property Custodian)
// >> ======================================================================
// % Facility Reservation Controllers
var facilityReservationStaffController = require('../controllers/staff/frs/facility_reservation.controller')

router.get(
    '/pup_staff/view/facility_reservation',
    facilityReservationStaffController.viewAllFacilityReservation
)
router.get(
    '/pup_staff/view/facility_reservation/:facility_reservation_id',
    facilityReservationStaffController.viewSpecificFacilityReservation
)
router.put(
    '/pup_staff/status/facility_reservation/:facility_reservation_id',
    facilityReservationStaffController.changeStatusFacilityReservation
)

// * Export Module to use in ../index.js
module.exports = router
