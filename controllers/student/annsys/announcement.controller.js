// ? ======================================================================
// ? ANNOUNCEMENT CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get 10 Announcements (announcement_type = "Announcement")
// % ROUTE: mypupqc/v1/annsys/student/get_ten_announcements
exports.getTenAnnouncements = (req, res) => {
    db.Announcement.findAll({
        where: {
            announcement_type: 'Announcement',
            announcement_status: {
                [Op.not]: ['Deleted', 'Hidden'],
            },
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
        order: [['created_at', 'DESC']],
        limit: 10,
    })
        .then(data => {
            if (data.length > 0) {
                dataResponse(res, data, 'Announcements retrieved successfully.')
            } else {
                emptyDataResponse(res, 'No announcements found.')
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Get Specific Announcement
// % ROUTE: mypupqc/v1/annsys/student/get_announcement/:announcement_id
exports.getSpecificAnnouncement = (req, res) => {
    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(data => {
            if (data) {
                dataResponse(res, data, 'Announcement retrieved successfully.')
            } else {
                emptyDataResponse(res, 'No announcement found.')
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}
