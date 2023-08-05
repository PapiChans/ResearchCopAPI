var router = require('express').Router()
const { researchAttachmentUpload, copyrightAttachmentUpload } = require('../helpers/imageMiddleware')

/* 
 >> ======================================================================
 >> SUPER ADMIN CONTROLLERS
 >> ======================================================================
 */

// % ======================================================================
// % ResearchCop Research Records Controller - information related to Research Record.
// % ======================================================================

var adminresearchDashboardController = require('../controllers/super_admin/researchcop/dashboard.controller')
router.get('/admin/researchcharts', adminresearchDashboardController.getResearchCount)
router.get('/admin/categorycharts', adminresearchDashboardController.getCategoryCount)
router.get('/admin/copyrightcharts', adminresearchDashboardController.getCopyrightCount)
router.get('/admin/programcharts', adminresearchDashboardController.getProgramCount)
router.get('/admin/researchcapstonecharts', adminresearchDashboardController.getResearchCapstoneCount)
router.get('/admin/researchstatuscharts', adminresearchDashboardController.getResearchStatusCount)
router.get('/admin/copyrightstatuscharts', adminresearchDashboardController.getCopyrightStatusCount)


/* 
 >> ======================================================================
 >> PUP STAFF CONTROLLERS
 >> ======================================================================
 */

// % ======================================================================
// % ResearchCop Research Records Controller - information related to Research Record.
// % ======================================================================
var researchDashboardController = require('../controllers/staff/researchcop/dashboard.controller')
router.get('/researchcharts', researchDashboardController.getResearchCount)
router.get('/categorycharts', researchDashboardController.getCategoryCount)
router.get('/copyrightcharts', researchDashboardController.getCopyrightCount)
router.get('/programcharts', researchDashboardController.getProgramCount)
router.get('/researchcapstonecharts', researchDashboardController.getResearchCapstoneCount)
router.get('/researchstatuscharts', researchDashboardController.getResearchStatusCount)
router.get('/copyrightstatuscharts', researchDashboardController.getCopyrightStatusCount)


var researchCopyrightController = require('../controllers/staff/researchcop/copyright.controller')
router.get('/copyright-submissions/allresearch', researchCopyrightController.viewAllResearchCopyrightRecords)
router.get('/copyright-submissions/research', researchCopyrightController.viewResearchCopyrightRecords)
router.get('/copyright-submissions/capstone', researchCopyrightController.viewCapstoneCopyrightRecords)
router.get('/copyright-submissions/:research_id', researchCopyrightController.viewSpecificCopyrightRecords)
router.delete('/copyright-submissions/rejectCopyright/:research_id', researchCopyrightController.rejectCopyrightRecords)
router.put('/copyright-submissions/approvedCopyright/:research_id', researchCopyrightController.approvedCopyrightRecords)

var researchRecordsController = require('../controllers/staff/researchcop/research_records.controller')
router.get('/research-records/allresearch', researchRecordsController.viewAllResearchRecords)
router.get('/research-records/research', researchRecordsController.viewResearchRecords)
router.get('/research-records/capstone', researchRecordsController.viewCapstoneRecords)
router.get('/research-records/:research_id', researchRecordsController.viewSpecificResearchRecords)
router.get('/research-records/info/:user_id', researchRecordsController.getAdmin)
router.delete(
    '/research-records/deleteResearch/:research_id',
    researchRecordsController.deleteResearchRecords
)

var researchPendingController = require('../controllers/staff/researchcop/research_pending.controller')
router.get('/research-pending/allresearch', researchPendingController.viewAllResearchPending)
router.get('/research-pending/research', researchPendingController.viewResearchPending)
router.get('/research-pending/capstone', researchPendingController.viewCapstonePending)
router.get('/research-pending/info/:user_id', researchPendingController.getAdmin)
router.get('/research-pending/:research_id', researchPendingController.viewSpecificResearchPending)
router.put(
    '/research-pending/approveResearch/:research_id',
    researchPendingController.approveResearchPending
)
router.delete(
    '/research-pending/rejectResearch/:research_id',
    researchPendingController.rejectResearchPending
)

var researchArchivesController = require('../controllers/staff/researchcop/research_archives.controller')
router.get('/research-archives/allresearch', researchArchivesController.viewAllResearchArchives)
router.get('/research-archives/research', researchArchivesController.viewResearchArchives)
router.get('/research-archives/capstone', researchArchivesController.viewCapstoneArchives)
router.get('/research-archives/:research_id', researchArchivesController.viewSpecificResearchArchives)
router.get(
    '/research-archives/remarks/:research_id',
    researchArchivesController.viewSpecificResearchRemarks
)
router.put(
    '/research-archives/returnResearch/:research_id',
    researchArchivesController.returnResearchRecords
)


/* 
 >> ======================================================================
 >> STUDENT CONTROLLERS
 >> ======================================================================
 */

// % ======================================================================
// % ResearchCop My Submissions Controller - Student Research Submissions
// % ======================================================================
var researchDashboardController = require('../controllers/student/researchcop/dashboard.controller')
router.get('/dashboard/allresearch', researchDashboardController.displayAllResearch)
router.post('/dashboard/research', researchDashboardController.displayResearch)
router.get('/dashboard/capstone', researchDashboardController.displayCapstone)
router.get('/dashboard/getSpecificResearch', researchDashboardController.viewSpecificResearch)

var researchAuthorController = require('../controllers/student/researchcop/author.controller')
router.get('/author/allresearch', researchAuthorController.displayAllResearch)
router.put('/author/editcoauthors/:research_id', researchAuthorController.editCoAuthors)

var mySubmissionsController = require('../controllers/student/researchcop/submissions.controller')
router.get('/my-submissions/allresearch', mySubmissionsController.viewAllMyResearchSubmissions)
router.get('/my-submissions/research', mySubmissionsController.viewMyResearchSubmissions)
router.get('/my-submissions/capstone', mySubmissionsController.viewMyCapstoneSubmissions)
router.get('/my-submissions/:research_id', mySubmissionsController.viewSpecificResearchRecords)
router.get(
    '/my-submissions/remarks/:research_id',
    mySubmissionsController.viewSpecificResearchRemarks
)
router.get('/my-submissions/info/:user_id', mySubmissionsController.getAuthor)
router.post('/my-submissions/add', mySubmissionsController.addMySubmissions)
router.put('/my-submissions/resubmitResearch/:research_id', mySubmissionsController.resubmitResearch)
router.put('/my-submissions/upload/:research_id', researchAttachmentUpload.any(), mySubmissionsController.uploadMySubmissions)
router.delete('/my-submissions/deleteupload/:research_id', mySubmissionsController.deleteResearchUpload)

router.put('/my-submissions/copyrightupload/:research_id', copyrightAttachmentUpload.any(), mySubmissionsController.uploadCopyright)
router.delete('/my-submissions/deletecopyrightupload/:research_id', mySubmissionsController.deleteCopyrightUpload)

// * Export Module to use in ../index.js
module.exports = router
