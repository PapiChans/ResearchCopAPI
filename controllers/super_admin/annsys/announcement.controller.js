// ? ======================================================================
// ? ANNOUNCEMENT CONTROLLER - SUPER ADMIN
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get All Announcements (whether news/advisory/announcement pa yan)
// % ROUTE: mypupqc/v1/annsys/super_admin/get_all_announcement
exports.getAllAnnouncements = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Announcement.findAll({
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
    })
        .then(data =>
            dataResponse(
                res,
                data,
                'Announcements fetched successfully!',
                'Announcements not fetched.'
            )
        )
        .catch(err => errResponse(res, err))
}

// % Get Specific Announcement
// % ROUTE: mypupqc/v1/annsys/super_admin/get_announcement/:announcement_id
exports.getSpecificAnnouncement = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Announcement.findOne({
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
        where: { announcement_id: req.params.announcement_id },
    })
        .then(data =>
            dataResponse(
                res,
                data,
                'Announcement fetched successfully!',
                'Announcement not fetched.'
            )
        )
        .catch(err => errResponse(res, err))
}

// % Change Status of Advisory/Announcement/News from Published to Hidden and vice versa
// % ROUTE: mypupqc/v1/annsys/super_admin/change_status/:announcement_id
exports.changeAdvisoryStatus = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
        },
    }).then(data => {
        if (data) {
            if (data.announcement_status == 'Published') {
                db.Announcement.update(
                    { announcement_status: 'Hidden' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                        },
                    }
                )
                    .then(data => {
                        if (data == 1) {
                            db.Announcement.findOne({
                                where: { announcement_id: req.params.announcement_id },
                            })
                                .then(data => {
                                    dataResponse(
                                        res,
                                        data,
                                        'Announcement status changed.',
                                        'Announcement status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Announcement status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            } else if (data.announcement_status == 'Hidden') {
                db.Announcement.update(
                    { announcement_status: 'Published' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                        },
                    }
                )
                    .then(data => {
                        if (data == 1) {
                            db.Announcement.findOne({
                                where: { announcement_id: req.params.announcement_id },
                            })
                                .then(data => {
                                    dataResponse(
                                        res,
                                        data,
                                        'Announcement status changed.',
                                        'Announcement status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Announcement status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
        } else {
            emptyDataResponse(res, 'Announcement not found.')
        }
    })
}

// % Delete Announcement
// % ROUTE: mypupqc/v1/annsys/super_admin/delete_announcement/:announcement_id
exports.deleteAnnouncement = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Announcement.update(
        { announcement_status: 'Deleted' },
        {
            where: {
                announcement_id: req.params.announcement_id,
            },
        }
    )
        .then(data => {
            if (data == 1) {
                db.Announcement.findOne({
                    where: { announcement_id: req.params.announcement_id },
                })
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'Announcement successfully deleted.',
                            'Announcement not deleted.'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else {
                emptyDataResponse(res, 'Announcement not deleted.')
            }
        })
        .catch(err => errResponse(res, err))
}
