// ? ======================================================================
// ? HOLIDAY CONTROLLER
// ? This controller is for queries related to holidays.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Gets all the holidays.
// % ROUTE: /mypupqc/v1/super_admin/holiday
exports.viewAllHolidays = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findAll({
        where: {
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
        },
    }).then(data => {
        if (data.length == 0) {
            emptyDataResponse(res, 'No holidays found.')
        }
        dataResponse(res, data, 'All holidays found.', 'No holidays found.')
    })
}

// % Gets a specific holiday.
// % ROUTE: /mypupqc/v1/super_admin/holiday/:holiday_id
exports.viewSpecificHoliday = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findOne({
        where: {
            holiday_id: req.params.holiday_id,
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
        },
    })
        .then(data => {
            if (data == null) {
                emptyDataResponse(res, 'No holiday found.')
            }
            dataResponse(res, data, 'Holiday found.', 'No holiday found.')
        })
        .catch(err => errResponse(res, err))
}

// % Gets all the holidays based on the year.
// % ROUTE: /mypupqc/v1/super_admin/holiday/year/:year
exports.viewHolidaysBasedOnYear = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findAll({
        where: {
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
            [Op.or]: [
                {
                    holiday_date: {
                        [Op.between]: [
                            new Date(req.params.year + '-01-01'),
                            new Date(req.params.year + '-12-31'),
                        ],
                    },
                },
                {
                    holiday_start_date: {
                        [Op.between]: [
                            new Date(req.params.year + '-01-01'),
                            new Date(req.params.year + '-12-31'),
                        ],
                    },
                },
            ],
        },
    }).then(data => {
        if (data.length == 0) {
            emptyDataResponse(res, 'No holidays found.')
        }
        dataResponse(res, data, 'All holidays found.', 'No holidays found.')
    })
}

// % Adds a holiday.
// % ROUTE: /mypupqc/v1/super_admin/holiday
exports.addHoliday = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.create(req.body)
        .then(data => {
            dataResponse(res, data, 'Holiday successfully added.', 'Failed to add holiday.')
        })
        .catch(err => errResponse(res, err))
}

// % Updates a holiday.
// % ROUTE: /mypupqc/v1/super_admin/holiday/edit/:holiday_id
exports.editHoliday = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findOne({
        where: {
            holiday_id: req.params.holiday_id,
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
        },
    })
        .then(data => {
            if (data == null) {
                emptyDataResponse(res, 'No holiday found.')
            } else {
                db.Holiday.update(req.body, {
                    where: {
                        holiday_id: req.params.holiday_id,
                    },
                })
                    .then(data => {
                        if (data == 1) {
                            db.Holiday.findOne({
                                where: {
                                    holiday_id: req.params.holiday_id,
                                },
                            })
                                .then(data => {
                                    dataResponse(
                                        res,
                                        data,
                                        'Holiday successfully updated.',
                                        'Failed to update holiday.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Failed to update holiday.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Change Status of a Holiday to Active/Inactive. Acts like a Switch, if Active then switch to Inactive then vice versa.
// % ROUTE: /mypupqc/v1/super_admin/holiday/status/:holiday_id
exports.changeHolidayStatus = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findOne({
        where: {
            holiday_id: req.params.holiday_id,
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
        },
    })
        .then(data => {
            if (data == null) {
                emptyDataResponse(res, 'No holiday found.')
            } else {
                if (data.holiday_status == 'Active') {
                    data.holiday_status = 'Inactive'
                } else if (data.holiday_status == 'Inactive') {
                    data.holiday_status = 'Active'
                }
                data.save()
                dataResponse(
                    res,
                    data,
                    'Holiday status successfully changed.',
                    'Failed to change holiday status.'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// % Deletes a holiday.
// % ROUTE: /mypupqc/v1/super_admin/holiday/delete/:holiday_id
exports.deleteHoliday = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Holiday.findOne({
        where: {
            holiday_id: req.params.holiday_id,
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
        },
    })
        .then(data => {
            if (data == null) {
                emptyDataResponse(res, 'No holiday found.')
            } else {
                db.Holiday.update(
                    { holiday_status: 'Deleted' },
                    {
                        where: {
                            holiday_id: req.params.holiday_id,
                        },
                    }
                )
                    .then(data => {
                        if (data == 1) {
                            db.Holiday.findOne({
                                where: {
                                    holiday_id: req.params.holiday_id,
                                },
                            })
                                .then(data => {
                                    dataResponse(
                                        res,
                                        data,
                                        'Holiday successfully deleted.',
                                        'Failed to delete holiday.'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        } else {
                            emptyDataResponse(res, 'Failed to delete holiday.')
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}
