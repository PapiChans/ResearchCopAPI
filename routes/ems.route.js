var router = require('express').Router()
const {
    reservationAttachmentsUpload,
    pubmatsImageUpload,
    accomplishmentReportUpload,
} = require('../helpers/imageMiddleware')

/**
 * =====================================================================
 * * EMS ROUTES
 * =====================================================================
 */

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================
// % -> Reservations Page
var eventReservationStudentController = require('../controllers/student/ems/reservation.controller')
router.post(
    '/student/add/reservation',
    reservationAttachmentsUpload.any(),
    eventReservationStudentController.addReservation
)
router.get(
    '/student/view/organization_reservation',
    eventReservationStudentController.viewEventsOfOrganization
)
router.get('/student/view/reservation', eventReservationStudentController.viewUserEventReservation)
router.get(
    '/student/view/reservation/:reservation_id',
    eventReservationStudentController.viewSpecificReservation
)
router.put(
    '/student/add/pubmats/:reservation_id',
    pubmatsImageUpload.any(),
    eventReservationStudentController.addPubmats
)
router.put(
    '/student/edit/reservation/:reservation_id',
    reservationAttachmentsUpload.any(),
    eventReservationStudentController.editReservation
)
router.put(
    '/student/cancel/reservation/:reservation_id',
    eventReservationStudentController.cancelReservation
)
// % -> Evaluations Page
var eventEvaluationStudentController = require('../controllers/student/ems/evaluation.controller')
router.get('/student/view/organization_evaluation', eventEvaluationStudentController.viewEvaluation)
router.get(
    '/student/view/evaluation/:evaluation_id',
    eventEvaluationStudentController.viewSpecificEvaluation
)
router.post(
    '/student/add/evaluation/:reservation_id',
    eventEvaluationStudentController.addEvaluation
)
router.post(
    '/student/add/accomplishment_report/:reservation_id',
    accomplishmentReportUpload.any(),
    eventEvaluationStudentController.addAccomplishmentReport
)

// % -> Analytics Page
router.get(
    '/student/view/evaluation_analytics',
    eventEvaluationStudentController.viewStudentEvaluationAnalytics
)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS (Doctor, Dentist, Guidance Counsellor)
// >> ======================================================================
// % -> Signatory Management Page
var signatoryStaffController = require('../controllers/staff/ems/signatory.controller')
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

// % -> Reservations Page
var reservationStaffController = require('../controllers/staff/ems/reservation.controller')
router.get('/pup_staff/view/reservation', reservationStaffController.viewAllReservationHistoryStaff)
router.get(
    '/pup_staff/view/pending_reservation',
    reservationStaffController.viewAllPendingReservation
)
router.get(
    '/pup_staff/approved_reservation',
    reservationStaffController.viewAllApprovedReservationStaff
)
router.get(
    '/pup_staff/view/reservation/:reservation_id',
    reservationStaffController.viewSpecificReservation
)
router.get(
    '/pup_staff/reservation_signatories/:reservation_id',
    reservationStaffController.viewAllSignatories
)
router.put(
    '/pup_staff/reservation/status/:reservation_id',
    reservationStaffController.editReservationStatus
)

// * Export Module to use in ../index.js
module.exports = router
