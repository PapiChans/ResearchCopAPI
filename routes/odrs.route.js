var router = require('express').Router()
var { odrsRoles } = require('../middlewares/odrsRolesMiddleware')

/*
 * =======================================================================
 * * ODRS ROUTES
 * =======================================================================
 */

/* 
 >> ======================================================================
 >> SUPER ADMIN CONTROLLERS
 >> ======================================================================
 */

// % -> Documents Controller
var documentAdminCtl = require('../controllers/super_admin/odrs/documents.controller')
router.post('/super_admin/upload_document', documentAdminCtl.uploadDocument)
router.get('/super_admin/view_documents', documentAdminCtl.viewAllDocuments)
router.get('/super_admin/view_deleted_documents', documentAdminCtl.viewAllDeletedDocuments)
router.get('/super_admin/view_document/:document_id', documentAdminCtl.viewSpecificDocument)
router.put('/super_admin/edit_document/:document_id', documentAdminCtl.editDocument)
router.delete('/super_admin/delete_document/:document_id', documentAdminCtl.deleteDocument)

// % -> Requests Controller
var requestAdminCtl = require('../controllers/super_admin/odrs/requests.controller')
router.get('/super_admin/view_requests', requestAdminCtl.viewAllRequests)
router.get('/super_admin/view_request/:request_id', requestAdminCtl.viewSpecificRequest)
router.delete('/super_admin/delete_request/:request_id', requestAdminCtl.deleteRequest)
router.get('/super_admin/requests_history', requestAdminCtl.viewRequestsHistory)
router.get(
    '/super_admin/requests_history/:type_of_status',
    requestAdminCtl.viewRequestsHistoryStatus
)
router.get('/super_admin/fetch_oic_records', requestAdminCtl.fetchOicRecords)

// % -> Analytics Controller
var analyticsStaffCtl = require('../controllers/super_admin/analytics.controller')
router.get('/super_admin/analytics/requests', analyticsStaffCtl.getRequestsPageAnalytics)
router.get('/super_admin/analytics/history', analyticsStaffCtl.getHistoryPageAnalytics)

/* 
 >> ======================================================================
 >> PUP STAFF CONTROLLERS
 >> ======================================================================
 */

// % -> Documents Controller
var documentStaffCtl = require('../controllers/staff/odrs/documents.controller')
router.post('/pup_staff/upload_document', odrsRoles, documentStaffCtl.uploadDocument)
router.get('/pup_staff/view_documents', odrsRoles, documentStaffCtl.viewAllDocuments)
router.get(
    '/pup_staff/view_document/:document_id',
    odrsRoles,
    documentStaffCtl.viewSpecificDocument
)
router.put('/pup_staff/edit_document/:document_id', odrsRoles, documentStaffCtl.editDocument)

// % -> Requests Controller
var requestStaffCtl = require('../controllers/staff/odrs/requests.controller')
router.get('/pup_staff/view_requests', odrsRoles, requestStaffCtl.viewAllRequests)
router.get(
    '/pup_staff/view_requests/:type_of_status',
    odrsRoles,
    requestStaffCtl.viewAllRequestsStatus
)
router.get('/pup_staff/view_request/:request_id', odrsRoles, requestStaffCtl.viewSpecificRequest)
router.put(
    '/pup_staff/update_request_status/:status/:request_id',
    odrsRoles,
    requestStaffCtl.updateRequestStatus
)
router.get('/pup_staff/requests_history', odrsRoles, requestStaffCtl.viewRequestsHistory)
router.get('/pup_staff/fetch_oic_records', requestStaffCtl.fetchOicRecords)

// % -> Signatories Controller
var signatoryStaffCtl = require('../controllers/staff/odrs/signatories.controller')
router.get('/pup_staff/view_signatory_users', odrsRoles, signatoryStaffCtl.viewSignatoryUsers)
router.get('/pup_staff/view_all_signatories', odrsRoles, signatoryStaffCtl.viewAllSignatories)
router.get(
    '/pup_staff/view_all_approved_signatories',
    odrsRoles,
    signatoryStaffCtl.viewAllApprovedSignatories
)
router.get(
    '/pup_staff/view_all_onhold_signatories',
    odrsRoles,
    signatoryStaffCtl.viewAllOnholdSignatories
)
router.get(
    '/pup_staff/view_signatory/:request_id',
    odrsRoles,
    signatoryStaffCtl.viewSpecificSignatory
)
router.get(
    '/pup_staff/view_request_signatory/:request_id/:document_id',
    odrsRoles,
    signatoryStaffCtl.viewSpecificRequestSignatory
)
router.put(
    '/pup_staff/approve_signatory/:request_id/:document_id',
    signatoryStaffCtl.approveSignatory
)
router.put('/pup_staff/onhold_signatory/:request_signatory_id', signatoryStaffCtl.onholdSignatory)
router.put('/pup_staff/revert_onhold/:request_signatory_id', signatoryStaffCtl.revertOnhold)

// % -> Evaluation Controller
var evaluationStaffCtl = require('../controllers/staff/odrs/evaluation.controller')
router.get(
    '/pup_staff/view_evaluation/:evaluation_id',
    odrsRoles,
    evaluationStaffCtl.viewEvaluation
)

// % -> Evaluation Analytics Controller
var evaluationAnalyticsStaffCtl = require('../controllers/staff/odrs/evaluation_analytics.controller')
router.get(
    '/pup_staff/evaluation_analytics/total_average_rating',
    evaluationAnalyticsStaffCtl.totalAverageRating
)
router.get(
    '/pup_staff/evaluation_analytics/number_of_evaluated_requests',
    evaluationAnalyticsStaffCtl.numberOfEvaluatedRequests
)
router.get(
    '/pup_staff/evaluation_analytics/average_rating_of_evaluated_requests',
    evaluationAnalyticsStaffCtl.averageRatingOfEvaluatedRequests
)
router.get(
    '/pup_staff/evaluation_analytics/number_of_evaluations_for_this_user_for_the_current_year',
    evaluationAnalyticsStaffCtl.evaluationCountForThisUserThisYear
)

// % -> Analytics Controller
var analyticsStaffCtl = require('../controllers/staff/analytics.controller')
router.get('/pup_staff/analytics/requests', odrsRoles, analyticsStaffCtl.getRequestsPageAnalytics)
router.get('/pup_staff/analytics/history', odrsRoles, analyticsStaffCtl.getHistoryPageAnalytics)

/* 
 >> ======================================================================
 >> STUDENT CONTROLLERS
 >> ======================================================================
 */

// % -> Documents Controller
var documentStudentCtl = require('../controllers/student/odrs/documents.controller')
router.get('/student/view_documents', documentStudentCtl.viewAllDocuments)
router.get('/student/view_documents/:type', documentStudentCtl.viewAllDocumentsTypes)
router.get('/student/view_document/:document_id', documentStudentCtl.viewSpecificDocument)

// % -> Requests Controller
var requestStudentCtl = require('../controllers/student/odrs/requests.controller')
router.post('/student/add_request', requestStudentCtl.addRequest)
router.get('/student/view_requests', requestStudentCtl.viewAllRequests)
router.get('/student/view_request', requestStudentCtl.viewUserRequest)
router.get('/student/view_request/:request_id', requestStudentCtl.viewSpecificRequest)
router.put('/student/update_request_status/:status', requestStudentCtl.updateRequestStatus)
router.get('/student/requests_history', requestStudentCtl.viewRequestsHistory)
router.get(
    '/student/document_requirements/:request_id',
    requestStudentCtl.viewDocumentsRequirements
)
router.get('/student/fetch_oic_records', requestStudentCtl.fetchOicRecords)

// % -> Evaluations Controller
var evaluationStudentCtl = require('../controllers/student/odrs/evaluation.controller')
router.get('/student/view_evaluation/:evaluation_id', evaluationStudentCtl.viewEvaluation)
router.post('/student/add_evaluation/:request_id', evaluationStudentCtl.addEvaluation)

// * Export Module to use in ../index.js
module.exports = router
