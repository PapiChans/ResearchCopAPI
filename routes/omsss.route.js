var router = require('express').Router()
const { philHealthIDUpload, vaccinationCardUpload } = require('../helpers/imageMiddleware')
/**
 * =====================================================================
 * * OMSSS ROUTES
 * =====================================================================
 */

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================
// % -> Appointments Controller
var appointmentOverallController = require('../controllers/super_admin/omsss/appointment.controller')
router.get(
    '/super_admin/view_appointments_except_done',
    appointmentOverallController.viewAllAppointmentsExceptDone
)
router.get(
    '/super_admin/view_done_appointments',
    appointmentOverallController.viewAllDoneAppointments
)
router.get(
    '/super_admin/view_appointment/:appointment_id',
    appointmentOverallController.viewSpecificAppointment
)
router.delete(
    '/super_admin/delete_appointment/:appointment_id',
    appointmentOverallController.deleteAppointment
)

// % -> Analytics Controller
var adminAnalyticsController = require('../controllers/super_admin/analytics.controller')
router.get(
    '/super_admin/analytics/view_done_appointment',
    adminAnalyticsController.getAppointmentDoneCount
)
router.get(
    '/super_admin/analytics/view_done_appointment_annual',
    adminAnalyticsController.getAppointmentDoneCountAnnual
)
router.get(
    '/super_admin/analytics/view_pending_appointment',
    adminAnalyticsController.getAppointmentPendingCount
)
router.get(
    '/super_admin/analytics/pie_chart_consultation_status',
    adminAnalyticsController.getPieChartConsultationStatus
)
router.get(
    '/super_admin/analytics/consultation_type_count',
    adminAnalyticsController.getConsultationTypeCount
)

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================
// % -> Patient Information Controller
const patientInformationController = require('../controllers/student/omsss/patient_information.controller')
// * This is specific to the currently logged in student.
router.get('/student/patient_information', patientInformationController.viewPatientInformation)
router.put(
    '/student/patient_information',
    philHealthIDUpload.any(),
    patientInformationController.editPatientInformation
)
router.delete(
    '/student/patient_information/philhealth_id_image',
    patientInformationController.deletePhilhealthIDImage
)

// % -> Medical History Controller
const medicalHistoryController = require('../controllers/student/omsss/medical_history.controller')
// * This is specific to the currently logged in student.
router.get('/student/medical_history', medicalHistoryController.viewMedicalHistory)
router.put('/student/medical_history', medicalHistoryController.editMedicalHistory)

// % -> Immunization Controller
const immunizationController = require('../controllers/student/omsss/immunization.controller')
// * This is specific to the currently logged in student.
// >> Note: In the future magbabago ito dahil file uploading ito.
router.get('/student/view_immunization', immunizationController.viewImmunization)
router.put(
    '/student/edit_immunization',
    vaccinationCardUpload.any(),
    immunizationController.editImmunization
)
router.delete('/student/delete_vaccination_card', immunizationController.deleteVaccinationCard)

// % -> Health Appointment Controller
const healthAppointmentController = require('../controllers/student/omsss/health_appointment.controller')
// >> Appointment Type
router.get('/student/view_medical_appointment', healthAppointmentController.viewMedicalAppointment)
router.get('/student/view_dental_appointment', healthAppointmentController.viewDentalAppointment)
router.get(
    '/student/view_guidance_appointment',
    healthAppointmentController.viewGuidanceAppointment
)

// >> General Appointment Functions
router.get(
    '/student/view_all_user_appointments',
    healthAppointmentController.viewAllUserAppointments
)
router.get(
    '/student/view_appointment/:appointment_id',
    healthAppointmentController.viewSpecificAppointment
)
router.get('/student/appointment_logs', healthAppointmentController.viewAppointmentLogs)
router.post('/student/add_appointment', healthAppointmentController.addAppointment)
router.put(
    '/student/cancel_appointment/:appointment_id',
    healthAppointmentController.cancelAppointment
)

// % -> Evaluation Controller
const evaluationController = require('../controllers/student/omsss/evaluation.controller')
router.get('/student/view_evaluation/:appointment_id', evaluationController.viewEvaluation)
router.post('/student/add_evaluation/:appointment_id', evaluationController.addEvaluation)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS (Doctor, Dentist, Guidance Counsellor)
// >> ======================================================================
const staffAppointmentController = require('../controllers/staff/omsss/appointment.controller')
// % -> General Controller
router.get(
    '/pup_staff/view_pending_approved_appointment/:appointment_type',
    staffAppointmentController.viewAllPendingAppprovedAppointmentBasedOnType
)
router.get(
    '/pup_staff/view_appointment_analytics/:appointment_type',
    staffAppointmentController.viewAppointmentAnalytics
)
router.get(
    '/pup_staff/view_specific_appointment/:appointment_id',
    staffAppointmentController.viewSpecificAppointment
)
router.get(
    '/pup_staff/patient_information/:user_id',
    staffAppointmentController.viewPatientInformation
)
router.get('/pup_staff/medical_history/:user_id', staffAppointmentController.viewMedicalHistory)
router.get('/pup_staff/view_immunization/:user_id', staffAppointmentController.viewImmunization)
router.put('/pup_staff/status/:appointment_id', staffAppointmentController.updateStatus)

// % -> Analytics Controller
const staffAnalyticsController = require('../controllers/staff/analytics.controller')
router.get(
    '/pup_staff/view_analytics_for_consultation_status/:appointment_type',
    staffAnalyticsController.getConsultationStatusCount
)

// % -> Evaluation Controller
const staffEvaluationController = require('../controllers/staff/omsss/evaluation.controller')
router.get('/pup_staff/view_evaluation/', staffEvaluationController.viewEvaluation)
router.get(
    '/pup_staff/view_evaluation/:evaluation_id',
    staffEvaluationController.viewSpecificEvaluation
)

// % -> Evaluation Analytics
const staffEvaluationAnalyticsController = require('../controllers/staff/omsss/evaluation_analytics.controller')
router.get(
    '/pup_staff/evaluation_analytics/total_average_rating',
    staffEvaluationAnalyticsController.evaluationAnalyticsTotalAverageRating
)
router.get(
    '/pup_staff/evaluation_analytics/number_of_evaluated_appointments',
    staffEvaluationAnalyticsController.evaluationAnalyticsNumberOfEvaluatedAppointments
)
router.get(
    '/pup_staff/evaluation_analytics/average_rating_of_evaluated_appointments',
    staffEvaluationAnalyticsController.evaluationAnalyticsAverageRatingOfEvaluatedAppointments
)
router.get(
    '/pup_staff/evaluation_analytics/number_of_is_evaluated_by_consultation_type',
    staffEvaluationAnalyticsController.evaluationCountByConsultationType
)
router.get(
    '/pup_staff/evaluation_analytics/number_of_evaluations_for_this_user_for_the_current_year',
    staffEvaluationAnalyticsController.evaluationCountForThisUserThisYear
)

// * Export Module to use in ../index.js
module.exports = router
