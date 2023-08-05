// ? ======================================================================
// ? EVALUATION CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const monthMap = {
    1: 'january',
    2: 'february',
    3: 'march',
    4: 'april',
    5: 'may',
    6: 'june',
    7: 'july',
    8: 'august',
    9: 'september',
    10: 'october',
    11: 'november',
    12: 'december',
}

// % View All Evaluation of an Organization
// % ROUTE: /mypupqc/v1/ems/student/view/organization_evaluation (GET)
exports.viewEvaluation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const organization_id = await db.OrganizationOfficers.findOne({
        where: {
            user_id: req.user.user_id,
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'You are not an officer of any organization.')
            } else {
                return data.organization_id
            }
        })
        .catch(err => errResponse(res, err))

    db.EventEvaluation.findAll({
        where: {
            organization_id: organization_id,
        },
        include: [
            {
                model: db.EventReservation,
                as: 'reservation_evaluation',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Evaluation
// % ROUTE: /mypupqc/v1/odrs/student/view/evaluation/:evaluation_id (GET)
exports.viewSpecificEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const evaluation_id = req.params.evaluation_id

    db.EventEvaluation.findByPk(evaluation_id, {
        include: [
            {
                model: db.EventReservation,
                as: 'reservation_evaluation',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        })
        .catch(err => errResponse(res, err))
}

// % Add Evaluation
// % ROUTE: /mypupqc/v1/ems/student/add/evaluation/:reservation_id (POST)
exports.addEvaluation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const reservation_id = req.params.reservation_id

    await db.EventReservation.findByPk(reservation_id, {
        where: {
            reserve_status: 'Done',
        },
    }).then(data => {
        if (data == null) {
            errResponse(res, 'Event Reservation not found or not yet done.')
        }
    })

    const organization_id = await db.OrganizationOfficers.findOne({
        where: {
            user_id: req.user.user_id,
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'You are not an officer of any organization.')
            } else {
                return data.organization_id
            }
        })
        .catch(err => errResponse(res, err))

    req.body.organization_id = organization_id

    db.EventEvaluation.create(req.body)
        .then(data => {
            dataResponse(res, data, 'Evaluation added successfully', 'Unable to add evaluation')
        })
        .catch(err => errResponse(res, err))
}

// % Add Accomplishment Report
// % ROUTE: /mypupqc/v1/ems/student/add/accomplishment_report/:reservation_id (POST)
exports.addAccomplishmentReport = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const reservation_id = req.params.reservation_id

    if (!req.files) {
        errResponse(res, 'No file uploaded.')
    }

    // >> Upload the attachments to the Database
    req.files.forEach(file => {
        if (file.fieldname == 'accomplishment_report') {
            req.body.accomplishment_report = file.blobName
        }
    })

    db.EventReservation.update(
        {
            accomplishment_report: req.body.accomplishment_report,
        },
        {
            where: {
                reservation_id: reservation_id,
            },
        }
    )
        .then(data => {
            if (data[0] == 0) {
                errResponse(res, 'Event Reservation not updated.')
            } else {
                dataResponse(
                    res,
                    data,
                    'Accomplishment Report added successfully',
                    'Unable to add accomplishment report'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// ? ======================================================================
// ? EVALUATION ANALYTICS CONTROLLER - PUP STAFF
// ? ======================================================================

// % All Evaluation Analytics for an Organization
// % ROUTE: /mypupqc/v1/ems/student/view/evaluation_analytics (POST)
exports.viewStudentEvaluationAnalytics = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    let data = {
        organization_officers: 0,
        approved_events: 0,
        cancelled_events: 0,
        event_platform_count: {
            on_campus: 0,
            online: 0,
            hybrid: 0,
        },
        reservation_by_month: {},
    }

    const organization_id = await db.OrganizationOfficers.findOne({
        where: {
            user_id: req.user.user_id,
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'You are not an officer of any organization.')
            } else {
                return data.organization_id
            }
        })
        .catch(err => errResponse(res, err))

    await db.OrganizationOfficers.count({
        where: {
            organization_id: organization_id,
        },
    })
        .then(count => {
            data.organization_officers = count
        })
        .catch(err => errResponse(res, err))

    await db.EventReservation.count({
        where: {
            organization_id: organization_id,
            reserve_status: 'Approved & Released',
        },
    })
        .then(count => {
            data.approved_events = count
        })
        .catch(err => errResponse(res, err))

    await db.EventReservation.count({
        where: {
            organization_id: organization_id,
            reserve_status: {
                [Op.or]: ['Cancelled by Student', 'Cancelled by Staff'],
            },
        },
    })
        .then(count => {
            data.cancelled_events = count
        })
        .catch(err => errResponse(res, err))

    await db.EventReservation.count({
        col: 'event_platform',
        group: ['event_platform'],
        where: {
            organization_id: organization_id,
        },
    })
        .then(result => {
            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.event_platform === 'On-Campus')
                    data.event_platform_count.on_campus = count
                if (element.event_platform === 'Online') data.event_platform_count.online = count
                if (element.event_platform === 'Hybrid') data.event_platform_count.hybrid = count
            })
        })
        .catch(err => errResponse(res, err))

    const currentYear = new Date().getFullYear() // Get the current year

    await db.EventReservation.count({
        col: 'reserve_date',
        group: [db.sequelize.literal(`EXTRACT(month FROM reserve_date)`)],
        where: {
            reserve_date: {
                [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
            },
        },
    })
        .then(result => {
            result.forEach(item => {
                const monthName = monthMap[item.date_part]
                data.reservation_by_month[monthName] = item.count
            })
        })
        .catch(err => errResponse(res, err))

    dataResponse(res, data, 'Evaluation Analytics found', 'Evaluation Analytics not found...')
}
