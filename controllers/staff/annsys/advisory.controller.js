// ? ======================================================================
// ? ADVISORY CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')


// % Get All Advisory From User
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_advisory_from_user
exports.getAllAdvisoryFromUser = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: req.user.user_id,
            announcement_type: 'Advisory',
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
            dataResponse(res, data, 'Advisory found.', 'Advisory not found.')
        } else {
            emptyDataResponse(res, 'Advisory not found.')
        }
    })
}

// % Get All Advisory Not from the Logged In User
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_all_advisory
exports.getAllAdvisory = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findAll({
        where: {
            user_id: {
                [Op.ne]: req.user.user_id,
            },
            announcement_type: 'Advisory',
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
            dataResponse(res, data, 'Advisory found.', 'Advisory not found.')
        } else {
            emptyDataResponse(res, 'Advisory not found.')
        }
    })
}

// % Get Specific Advisory
// % ROUTE: mypupqc/v1/annsys/pup_staff/get_advisory/:announcement_id
exports.getSpecificAdvisory = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'Advisory',
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
            dataResponse(res, data, 'Advisory found.', 'Advisory not found.')
        } else {
            emptyDataResponse(res, 'Advisory not found.')
        }
    })
}

// % Add Advisory
// % ROUTE: mypupqc/v1/annsys/pup_staff/add_advisory
exports.addAdvisory = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    // add user_id to req.body
    req.body.user_id = req.user.user_id

    if (!req.files) {
        // * Kung walang req.files, meaning pwede natin i-add lang yung announcement na walang image
        db.Announcement.create(req.body)
            .then(data => {
                dataResponse(res, data, 'Advisory successfully added.', 'Advisory not added.')
            })
            .catch(err => {
                errResponse(res, err)
            })
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
                dataResponse(res, data, 'Advisory successfully added.', 'Advisory not added.')
            })
            .catch(err => {
                errResponse(res, err)
            })
    }
}

// % Edit Advisory
// % ROUTE: mypupqc/v1/annsys/pup_staff/edit_advisory/:announcement_id
exports.editAdvisory = async (req, res) => {

    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v
    
    // include user_id to req.body
    req.body.user_id = req.user.user_id

    const announcement_id = req.params.announcement_id

    if (!req.files) {
    db.Announcement.update(req.body, {where:{announcement_id: announcement_id}})
        .then(data => {
            dataResponse(res, data, 'Advisory successfully updated.', 'Advisory not updated.')
        })
        .catch(err => {
            errResponse(res, err)
        })
    } else {
    req.files.forEach(file => {
        console.log(file)
        if (file.fieldname == 'announcement_image') {
            req.body.announcement_image = file.blobName
        }
    })
    db.Announcement.update(req.body, {where:{announcement_id: announcement_id}})
        .then(data => {
            dataResponse(res, data, 'Advisory successfully updated.', 'Advisory not updated.')
        })
        .catch(err => {
            errResponse(res, err)
        })
    }

}



// % Change Status of Advisory Status from Published to Hidden and vice versa
// % ROUTE: mypupqc/v1/annsys/pup_staff/change_advisory_status/:announcement_id
exports.changeAdvisoryStatus = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.findOne({
        where: {
            announcement_id: req.params.announcement_id,
            announcement_type: 'Advisory',
        },
    }).then(data => {
        if (data) {
            if (data.announcement_status == 'Published') {
                db.Announcement.update(
                    { announcement_status: 'Hidden' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                            announcement_type: 'Advisory',
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
                                        'Advisory status changed.',
                                        'Advisory status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Advisory status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            } else if (data.announcement_status == 'Hidden') {
                db.Announcement.update(
                    { announcement_status: 'Published' },
                    {
                        where: {
                            announcement_id: req.params.announcement_id,
                            announcement_type: 'Advisory',
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
                                        'Advisory status changed.',
                                        'Advisory status not changed.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Advisory status not changed.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
        } else {
            emptyDataResponse(res, 'Advisory not found.')
        }
    })
}

// % Delete Advisory
// % ROUTE: mypupqc/v1/annsys/pup_staff/delete_advisory/:announcement_id
exports.deleteAdvisory = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Announcement.update(
        { announcement_status: 'Deleted' },
        {
            where: {
                announcement_id: req.params.announcement_id,
                announcement_type: 'Advisory',
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
                            'Advisory successfully deleted.',
                            'Advisory not deleted.'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else {
                emptyDataResponse(res, 'Advisory not deleted.')
            }
        })
        .catch(err => errResponse(res, err))
}
