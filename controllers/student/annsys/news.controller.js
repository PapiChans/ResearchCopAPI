// ? ======================================================================
// ? NEWS CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get All News From User
// % ROUTE: mypupqc/v1/annsys/student/get_news_from_user
exports.getAllNewsFromUser = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: req.user.user_id,
            announcement_type: 'News',
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
            dataResponse(res, data, 'News found.', 'News not found.')
        } else {
            emptyDataResponse(res, 'News not found.')
        }
    })
}

// % Get All News Not from the Logged In User
// % ROUTE: mypupqc/v1/annsys/student/get_all_news
exports.getAllNews = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: {
                [Op.ne]: req.user.user_id,
            },
            announcement_type: 'News',
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
            dataResponse(res, data, 'News found.', 'News not found.')
        } else {
            emptyDataResponse(res, 'News not found.')
        }
    })
}

// % Get Specific News
// % ROUTE: mypupqc/v1/annsys/student/get_news/:announcement_id
exports.getSpecificNews = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'News',
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
            dataResponse(res, data, 'News found.', 'News not found.')
        } else {
            emptyDataResponse(res, 'News not found.')
        }
    })
}

// % Add News
// % ROUTE: mypupqc/v1/annsys/student/add_news
exports.addNews = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // add user_id to req.body
    req.body.user_id = req.user.user_id

    if (!req.files) {
        // * Kung walang req.files, error response na required yon for news.
        errResponse(res, 'Image is required for news.')
    } else {
        // * kung meron, kailangan i-add si req.files sa req.body as req.body.announcement_image
        req.files.forEach(file => {
            console.log(file)
            if (file.fieldname == 'announcement_image') {
                req.body.announcement_image = file.blobName
            }
        })

        // * then add na sa database
        db.Announcement.create(req.body)
            .then(data => {
                dataResponse(res, data, 'News successfully added.', 'News not added.')
            })
            .catch(err => {
                errResponse(res, err)
            })
    }
}

// % Edit News
// % ROUTE: mypupqc/v1/annsys/student/edit_news/:announcement_id
exports.editNews = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v
}

// % Change Status of News Status from Published to Hidden and vice versa
// % ROUTE: mypupqc/v1/annsys/student/change_news_status/:announcement_id
exports.changeNewsStatus = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'News',
        },
    }).then(data => {
        if (data) {
            if (data.announcement_status == 'Published') {
                db.Announcement.update(
                    { announcement_status: 'Hidden' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                            announcement_type: 'News',
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
                                        'News status changed.',
                                        'News status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'News status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            } else if (data.announcement_status == 'Hidden') {
                db.Announcement.update(
                    { announcement_status: 'Published' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                            announcement_type: 'News',
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
                                        'News status changed.',
                                        'News status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'News status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
        } else {
            emptyDataResponse(res, 'News not found.')
        }
    })
}

// % Delete News
// % ROUTE: mypupqc/v1/annsys/student/delete_news/:announcement_id
exports.deleteNews = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Announcement.update(
        { announcement_status: 'Deleted' },
        {
            where: {
                announcement_id: req.params.announcement_id,
                announcement_type: 'News',
            },
        }
    )
        .then(data => {
            if (data == 1) {
                db.Announcement.findOne({
                    where: { announcement_id: req.params.announcement_id },
                })
                    .then(data => {
                        dataResponse(res, data, 'News successfully deleted.', 'News not deleted.')
                    })
                    .catch(err => errResponse(res, err))
            } else {
                emptyDataResponse(res, 'News not deleted.')
            }
        })
        .catch(err => errResponse(res, err))
}
