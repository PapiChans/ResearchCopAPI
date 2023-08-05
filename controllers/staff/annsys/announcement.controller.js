// ? ======================================================================
// ? ANNOUNCEMENT CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get All Announcement From User
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_announcement_from_user
exports.getAllAnnouncementFromUser = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: req.user.user_id,
            announcement_type: 'Announcement',
            announcement_status: {
                [Op.not]: 'Deleted',
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
    }).then(data => {
        if (data) {
            dataResponse(res, data, 'Announcement found.', 'Announcement not found.')
        } else {
            emptyDataResponse(res, 'Announcement not found.')
        }
    })
}

// % Get All Announcement Not from the Logged In User
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_all_announcement
exports.getAllAnnouncement = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: {
                [Op.ne]: req.user.user_id,
            },
            announcement_type: 'Announcement',
            announcement_status: {
                [Op.not]: 'Deleted',
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
    }).then(data => {
        if (data) {
            dataResponse(res, data, 'Announcement found.', 'Announcement not found.')
        } else {
            emptyDataResponse(res, 'Announcement not found.')
        }
    })
}

// % Get Specific Announcement
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_announcement/:announcement_id
exports.getSpecificAnnouncement = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'Announcement',
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
    }).then(data => {
        if (data) {
            dataResponse(res, data, 'Announcement found.', 'Announcement not found.')
        } else {
            emptyDataResponse(res, 'Announcement not found.')
        }
    })
}

// % Add Announcement
// % ROUTE: mypupqc/v1/annsys/pup_staff/add_announcement
exports.addAnnouncement = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    if (req.files) {
        // * Send an error response since images is not required in Announcements
        errResponse(res, 'Images are not required in Announcements.')
    }

    // add user_id to req.body
    req.body.user_id = req.user.user_id

    db.Announcement.create(req.body)
        .then(data => {
            dataResponse(res, data, 'Announcement successfully added.', 'Announcement not added.')
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Edit Announcement
// % ROUTE: mypupqc/v1/annsys/pup_staff/edit_announcement/:announcement_id
exports.editAnnouncement = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    if (req.files) {
        // * Send an error response since images is not required in Announcements
        errResponse(res, 'Images are not required in Announcements.')
    }

    // add user_id to req.body
    req.body.user_id = req.user.user_id
    const announcement_id = req.params.announcement_id;

    db.Announcement.update(req.body, {where: {announcement_id: announcement_id}})
        .then(data => {
            dataResponse(res, data, 'Announcement successfully updated.', 'Announcement not updated.')
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Change Status of Announcement Status from Published to Hidden and vice versa
// % ROUTE: mypupqc/v1/annsys/pup_staff/change_announcement_status/:announcement_id
exports.changeAnnouncementStatus = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'Announcement',
        },
    }).then(data => {
        if (data) {
            if (data.announcement_status == 'Published') {
                db.Announcement.update(
                    { announcement_status: 'Hidden' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                            announcement_type: 'Announcement',
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
                            announcement_type: 'Announcement',
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
// % ROUTE: mypupqc/v1/annsys/pup_staff/delete_announcement/:announcement_id
exports.deleteAnnouncement = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.update(
        { announcement_status: 'Deleted' },
        {
            where: {
                announcement_id: req.params.announcement_id,
                announcement_type: 'Announcement',
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
