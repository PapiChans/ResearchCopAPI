var router = require('express').Router()
var {
    annsysReporterRole,
    annsysPublicRelationsRole,
} = require('../middlewares/annsysRolesMiddleware')
const { announcementImageUpload } = require('../helpers/imageMiddleware')

// >> ======================================================================
// >> STUDENT CONTROLLERS
// >> ======================================================================

// % -> Announcement Controller: for Students
// % ======================================================================
const studentAnnouncementController = require('../controllers/student/annsys/announcement.controller')
router.get('/student/get_ten_announcements', studentAnnouncementController.getTenAnnouncements)
router.get(
    '/student/get_announcement/:announcement_id',
    studentAnnouncementController.getSpecificAnnouncement
)

// % -> News Controller: For Student with News Reporter Role
// % ======================================================================
// * -> Possibly may Add, Edit, Delete, and View News siya na sarili niya
const studentNewsController = require('../controllers/student/annsys/news.controller')
router.get(
    '/student/get_news_from_user',
    annsysReporterRole,
    studentNewsController.getAllNewsFromUser
)
router.get('/student/get_all_news', annsysReporterRole, studentNewsController.getAllNews)
router.get(
    '/student/get_news/:announcement_id',
    annsysReporterRole,
    studentNewsController.getSpecificNews
)

// ! with image sending -> possible multiple middleware
router.post(
    '/student/add_news',
    [annsysReporterRole, announcementImageUpload.any()],
    studentNewsController.addNews
)
router.put(
    '/student/edit_news/:announcement_id',
    [annsysReporterRole],
    studentNewsController.editNews
)
router.put(
    '/student/change_news_status/:announcement_id',
    annsysPublicRelationsRole,
    studentNewsController.changeNewsStatus
)
router.delete(
    '/student/delete_news/:announcement_id',
    annsysReporterRole,
    studentNewsController.deleteNews
)

// >> ======================================================================
// >> PUP STAFF CONTROLLERS
// >> ======================================================================
// * All Controllers: Add/Edit/Delete/View Announcement/Advisory/News

// % -> Announcement Controller: for PUP Staff with Public Relations Role
// % ======================================================================
const staffAnnouncementController = require('../controllers/staff/annsys/announcement.controller')
router.get(
    '/pup_staff/get_announcement_from_user',
    annsysPublicRelationsRole,
    staffAnnouncementController.getAllAnnouncementFromUser
)
router.get(
    '/pup_staff/get_all_announcement',
    annsysPublicRelationsRole,
    staffAnnouncementController.getAllAnnouncement
)
router.get(
    '/pup_staff/get_announcement/:announcement_id',
    annsysPublicRelationsRole,
    staffAnnouncementController.getSpecificAnnouncement
)
router.post(
    '/pup_staff/add_announcement',
    annsysPublicRelationsRole,
    staffAnnouncementController.addAnnouncement
)
router.put(
    '/pup_staff/edit_announcement/:announcement_id',
    [annsysPublicRelationsRole],
    staffAnnouncementController.editAnnouncement
)
router.put(
    '/pup_staff/change_announcement_status/:announcement_id',
    annsysPublicRelationsRole,
    staffAnnouncementController.changeAnnouncementStatus
)
router.delete(
    '/pup_staff/delete_announcement/:announcement_id',
    annsysPublicRelationsRole,
    staffAnnouncementController.deleteAnnouncement
)

// % -> News Controller: For PUP Staff with News Reporter Role
// % ======================================================================
const staffNewsController = require('../controllers/staff/annsys/news.controller')
router.get(
    '/pup_staff/get_news_from_user',
    annsysReporterRole,
    staffNewsController.getAllNewsFromUser
)
router.get('/pup_staff/get_all_news', annsysReporterRole, staffNewsController.getAllNews)
router.get(
    '/pup_staff/get_news/:announcement_id',
    annsysReporterRole,
    staffNewsController.getSpecificNews
)

// ! with image sending -> possible multiple middleware
router.post(
    '/pup_staff/add_news',
    [annsysReporterRole, announcementImageUpload.any()],
    staffNewsController.addNews
)
router.put(
    '/pup_staff/edit_news/:announcement_id',
    [annsysReporterRole, announcementImageUpload.any()],
    staffNewsController.editNews
)
router.put(
    '/pup_staff/change_news_status/:announcement_id',
    annsysPublicRelationsRole,
    staffNewsController.changeNewsStatus
)
router.delete(
    '/pup_staff/delete_news/:announcement_id',
    annsysReporterRole,
    staffNewsController.deleteNews
)

// % -> Advisory Controller: for PUP Staff with Public Relations Role
// % ======================================================================
const staffAdvisoryController = require('../controllers/staff/annsys/advisory.controller')
router.get(
    '/pup_staff/get_advisory_from_user',
    annsysPublicRelationsRole,
    staffAdvisoryController.getAllAdvisoryFromUser
)
router.get(
    '/pup_staff/get_all_advisory',
    annsysPublicRelationsRole,
    staffAdvisoryController.getAllAdvisory
)
router.get(
    '/pup_staff/get_advisory/:announcement_id',
    annsysPublicRelationsRole,
    staffAdvisoryController.getSpecificAdvisory
)

// ! with image sending -> possible multiple middleware
router.post(
    '/pup_staff/add_advisory',
    [annsysPublicRelationsRole, announcementImageUpload.any()],
    staffAdvisoryController.addAdvisory
)
router.put(
    '/pup_staff/edit_advisory/:announcement_id',
    [annsysPublicRelationsRole, announcementImageUpload.any()],
    staffAdvisoryController.editAdvisory
)
router.put(
    '/pup_staff/change_advisory_status/:announcement_id',
    annsysPublicRelationsRole,
    staffAdvisoryController.changeAdvisoryStatus
)
router.delete(
    '/pup_staff/delete_advisory/:announcement_id',
    annsysPublicRelationsRole,
    staffAdvisoryController.deleteAdvisory
)

// >> ======================================================================
// >> SUPER ADMIN CONTROLLERS
// >> ======================================================================

// * Specific Controllers only: View/Delete Announcement/Advisory/News
const adminAnnouncementController = require('../controllers/super_admin/annsys/announcement.controller')
router.get('/super_admin/get_all_announcement', adminAnnouncementController.getAllAnnouncements)
router.get(
    '/super_admin/get_announcement/:announcement_id',
    adminAnnouncementController.getSpecificAnnouncement
)
router.delete(
    '/super_admin/delete_announcement/:announcement_id',
    adminAnnouncementController.deleteAnnouncement
)

// * Export Module to use in ../index.js
module.exports = router
