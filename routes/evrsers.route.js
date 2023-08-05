var router = require('express').Router()
const {
    reservationAttachmentsUpload,
    facilityPictureUpload,
    pubmatsImageUpload,
} = require('../helpers/imageMiddleware')

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================
// % -> Facility Page
var facilityController = require('../controllers/super_admin/evrsers/facility.controller')
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

// % -> Reservation Page
var reservationAdminController = require('../controllers/super_admin/evrsers/reservation.controller')
router.get(
    '/super_admin/view_approved_reservation',
    reservationAdminController.viewAllApprovedReservationAdmin
)
router.get(
    '/super_admin/view_pending_reservation',
    reservationAdminController.viewAllPendingReservation
)
router.get('/super_admin/view_list_reservation', reservationAdminController.viewListReservations)
router.get(
    '/super_admin/view_for_evaluation',
    reservationAdminController.viewAllForEvaluationReservation
)
router.get('/super_admin/view_done', reservationAdminController.viewAllDoneReservation)
router.get('/super_admin/view_cancelled', reservationAdminController.viewAllCancelledReservation)
router.get(
    '/super_admin/view_reservation/:reservation_id',
    reservationAdminController.viewAdminSpecificReservation
)
router.put(
    '/super_admin/delete_reservation/:reservation_id',
    reservationAdminController.deleteReservation
)

// % -> Reservation History and Analytics Page
var adminAnalyticsController = require('../controllers/super_admin/analytics.controller')
router.get('/super_admin/facilities_count', adminAnalyticsController.getFacilitiesCount)
router.get(
    '/super_admin/annual_reservation_count',
    adminAnalyticsController.getAnnualReservationCount
)
router.get('/super_admin/all_reservation_count', adminAnalyticsController.getAllReservationCount)
router.get('/super_admin/organizer_count', adminAnalyticsController.getOrganizerCount)

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================
// % -> Reservation Controller
var reservationStudentController = require('../controllers/student/evrsers/reservation.controller')
// % -> View Reservations Page (Reservation Folder)
router.get('/student/view_reservations', reservationStudentController.viewAllReservations)
router.get(
    '/student/view_signatories/:reservation_id',
    reservationStudentController.viewAllSignatories
)
router.get(
    '/student/view_reservation/:reservation_id',
    reservationStudentController.viewSpecificReservation
)
router.post(
    '/student/add_reservation',
    reservationAttachmentsUpload.any(),
    reservationStudentController.addReservation
)
router.put(
    '/student/add_pubmats/:reservation_id',
    pubmatsImageUpload.any(),
    reservationStudentController.addPubmats
)
router.put(
    '/student/edit_reservation/:reservation_id',
    reservationAttachmentsUpload.any(),
    reservationStudentController.editReservation
)
router.delete(
    '/student/cancel_reservation/:reservation_id',
    reservationStudentController.cancelReservation
)
// % -> View Reservations Page (Facilities Folder)
router.get('/student/view_all_facilities', reservationStudentController.viewAllFacilitiesStudent)
// % -> View Reservations Page (Organization Folder)
router.get('/student/view_organization', reservationStudentController.viewAllOrganizationStudent)
router.get(
    '/student/view_organization_abb',
    reservationStudentController.viewAllOrganizationAbbStudent
)

// % -> Reservation History Page
router.get('/student/view_history', reservationStudentController.viewStudentHistory)

// % -> Dashboard Page
var dashboardStudentController = require('../controllers/student/evrsers/dashboard.controller')
router.get('/student/view_approved_reservation', dashboardStudentController.viewApprovedReservation)
router.get(
    '/student/student_specific_reservation/:reservation_id',
    dashboardStudentController.viewSpecificReservationStudent
)

// % -> Evaluation Management Page
var evaluationStudentController = require('../controllers/student/evrsers/evaluation.controller')
// >> [1] -> View Evaluation Page
router.get('/student/view_evaluation/:reservation_id', evaluationStudentController.viewEvaluation)
// >> [2] -> Add Evaluation Page
router.post('/student/add_evaluation/:reservation_id', evaluationStudentController.addEvaluation)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS
// >> ======================================================================
// % -> Reservation Controller
var organizerStaffController = require('../controllers/staff/evrsers/organizer.controller')

// % -> Organizer Management Page
router.get('/pup_staff/view_organizers', organizerStaffController.viewOrganizerStudents)
router.get('/pup_staff/view_student/:user_id', organizerStaffController.viewStudentStaff)
router.get(
    '/pup_staff/view_student_no_organizer',
    organizerStaffController.viewStudentNoOrganizerStaff
)
router.put('/pup_staff/set_organizer_role/:user_id', organizerStaffController.setOrganizerRoleStaff)

// % -> Reservations Page
var reservationStaffController = require('../controllers/staff/evrsers/reservation.controller')
router.get(
    '/pup_staff/approved_reservation',
    reservationStaffController.viewAllApprovedReservationStaff
)
router.get(
    '/pup_staff/view_pending_list_reservation',
    reservationStaffController.viewAllPendingReservation
)
router.get(
    '/pup_staff/view_details_reservation/:reservation_id',
    reservationStaffController.viewDetailsReservationStaff
)
router.get(
    '/pup_staff/view_all_signatories/:reservation_id',
    reservationStaffController.viewAllSignatoriesStaff
)
router.get(
    '/pup_staff/view_for_evaluation',
    reservationStaffController.viewAllForEvaluationReservationStaff
)
router.get('/pup_staff/view_cancelled', reservationStaffController.viewAllCancelledReservationStaff)
router.get('/pup_staff/view_all_done', reservationStaffController.viewAllDoneReservationStaff)
router.put(
    '/pup_staff/edit_status/:reservation_id',
    reservationStaffController.editReservationStatusStaff
)

// % -> Reservation History Page
router.get('/pup_staff/view_all_history', reservationStaffController.viewAllReservationHistoryStaff)

// % -> Signatory Management Page
var signatoryStaffController = require('../controllers/staff/evrsers/signatory.controller')
// >> [1] -> View All PUP Staff
router.get(
    '/pup_staff/signatory/view_all_staff',
    signatoryStaffController.viewAllPUPStaffForSignatory
)
// >> [2] -> Add Signatory to the Reservation
router.put(
    '/pup_staff/signatory/add_signatories/:reservation_id',
    signatoryStaffController.addSignatoriesReservation
)
// >> [3] -> View All Reservations to be Signed
router.get(
    '/pup_staff/signatory/view_user_to_be_signed_reservations',
    signatoryStaffController.viewReservationsToBeSigned
)
// >> [4.1] -> Approve Reservations
router.put(
    '/pup_staff/signatory/approve_reservation/:reservation_id',
    signatoryStaffController.approveReservation
)
// >> [4.2] -> On Hold Reservations
router.put(
    '/pup_staff/signatory/onhold_reservation/:reservation_signatory_id',
    signatoryStaffController.onHoldReservation
)
// >> [4.3] -> Revert On Hold Reservations
router.put(
    '/pup_staff/signatory/revert_onhold_reservation/:reservation_signatory_id',
    signatoryStaffController.revertOnHoldReservation
)
// >> [5] -> View All On Hold Reservations from User
router.get(
    '/pup_staff/signatory/view_user_onhold_reservations',
    signatoryStaffController.viewUserOnHoldReservations
)
// >> [6] -> View All Approved Reservations from User
router.get(
    '/pup_staff/signatory/view_user_approved_reservations',
    signatoryStaffController.viewUserApprovedReservations
)
// >> [O] -> View All Reservations with Signatories
router.get(
    '/pup_staff/signatory/view_specific_reservation_and_signatories/:reservation_id',
    signatoryStaffController.viewSpecificReservationAndSignatories
)

// % -> Evaluation Management Page
var evaluationStaffController = require('../controllers/staff/evrsers/evaluation.controller')
// >> [1] -> View All Reservations Evaluated
router.get('/pup_staff/view_evaluation', evaluationStaffController.viewEvaluation)
// >> [2] -> View Specific Reservation Evaluated
router.get(
    '/pup_staff/view_evaluation/:evaluation_id',
    evaluationStaffController.viewSpecificEvaluation
)

// % -> Evaluation Analytics Page
var evaluationAnalyticsController = require('../controllers/staff/evrsers/evaluation_analytics.controller')
// >> [1] -> View Average rating of EVRSERS evaluation for the Current Year
router.get(
    '/pup_staff/evaluation_analytics/total_average_rating',
    evaluationAnalyticsController.evaluationAnalyticsTotalAverageRating
)
// >> [2] -> View Number of Average of Evaluated Reservation of EVRSERS for the current year for each month (January - December)
router.get(
    '/pup_staff/evaluation_analytics/average_rating_of_evaluated_appointments',
    evaluationAnalyticsController.evaluationAnalyticsAverageRatingOfEvaluatedAppointments
)
// >> [3] -> View Number of Evaluated Reservation of EVRSERS for the current year for each month (January - December)
router.get(
    '/pup_staff/evaluation_analytics/evaluated_evaluation_done',
    evaluationAnalyticsController.evaluationCountByDone
)
// * Export Module to use in ../index.js
module.exports = router
