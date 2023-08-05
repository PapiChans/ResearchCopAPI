// ? ======================================================================
// ? EVALUATION ANALYTICS CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Analytics: Evaluation of Current Attending Physician (Average of Ratings) for the Current Year
// % ROUTE: /mypupqc/v1/omsss/pup_staff/evaluation_analytics/total_average_rating (GET)
exports.evaluationAnalyticsTotalAverageRating = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id
    const currentYear = new Date().getFullYear()

    db.Health_Appointment_Evaluation.findAll({
        where: {
            attending_physician: user_id,
            evaluation_date: {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE_PART', 'year', db.Sequelize.col('evaluation_date')),
                        currentYear
                    ),
                ],
            },
        },
        attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('average_rating')), 'average_rating_overall'],
        ],
    })
        .then(data => {
            if (data == null) {
                return emptyDataResponse(res, 'Evaluation not found...')
            } else {
                return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Analytics: Number of Evaluated Appointments of Current Attending Physician for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/omsss/pup_staff/evaluation_analytics/number_of_evaluated_appointments (GET)
exports.evaluationAnalyticsNumberOfEvaluatedAppointments = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id
    const currentYear = new Date().getFullYear()

    db.Health_Appointment_Evaluation.findAll({
        where: {
            attending_physician: user_id,
            evaluation_date: {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE_PART', 'year', db.Sequelize.col('evaluation_date')),
                        currentYear
                    ),
                ],
            },
        },
        attributes: [
            [
                db.sequelize.fn('COUNT', db.sequelize.col('evaluation_id')),
                'number_of_evaluated_appointments',
            ],
            [db.sequelize.fn('DATE_PART', 'month', db.sequelize.col('evaluation_date')), 'month'],
        ],
        group: ['month'],
    }).then(data => {
        if (data == null) {
            return emptyDataResponse(res, 'Evaluation not found...')
        } else {
            return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        }
    })
}

// % Analytics: Average Rating of Evaluated Appointments of Current Attending Physician for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/omsss/pup_staff/evaluation_analytics/average_rating_of_evaluated_appointments (GET)
exports.evaluationAnalyticsAverageRatingOfEvaluatedAppointments = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id
    const currentYear = new Date().getFullYear()

    db.Health_Appointment_Evaluation.findAll({
        where: {
            attending_physician: user_id,
            evaluation_date: {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE_PART', 'year', db.Sequelize.col('evaluation_date')),
                        currentYear
                    ),
                ],
            },
        },
        attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('average_rating')), 'average_rating'],
            [db.sequelize.fn('DATE_PART', 'month', db.sequelize.col('evaluation_date')), 'month'],
        ],
        group: ['month'],
    }).then(data => {
        if (data == null) {
            return emptyDataResponse(res, 'Evaluation not found...')
        } else {
            return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        }
    })
}

// % Analytics: Number of Evaluated Appointments by Consultation Type on Health_Appointments Table
// % ROUTE: /mypupqc/v1/omsss/pup_staff/evaluation_analytics/number_of_is_evaluated_by_consultation_type (GET)
exports.evaluationCountByConsultationType = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Health_Appointment.findAll({
        where: {
            attending_physician: user_id,
            is_evaluated: true,
        },
        attributes: [
            [
                db.sequelize.fn('COUNT', db.sequelize.col('consultation_type')),
                'number_of_evaluated_appointments',
            ],
            'consultation_type',
        ],
        group: ['consultation_type'],
    }).then(data => {
        if (data == null) {
            return emptyDataResponse(res, 'Evaluation not found...')
        } else {
            return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        }
    })
}

// % Analytics: Number of Evaluations for this User (Attending Physician) for the Current Year
// % ROUTE: /mypupqc/v1/omsss/pup_staff/evaluation_analytics/number_of_evaluations_for_this_user_for_the_current_year (GET)
exports.evaluationCountForThisUserThisYear = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id
    const currentYear = new Date().getFullYear()

    db.Health_Appointment_Evaluation.findAll({
        where: {
            attending_physician: user_id,
            evaluation_date: {
                [Op.and]: [
                    db.Sequelize.where(
                        db.Sequelize.fn('DATE_PART', 'year', db.Sequelize.col('evaluation_date')),
                        currentYear
                    ),
                ],
            },
        },
        attributes: [[db.Sequelize.fn('COUNT', db.Sequelize.col('evaluation_id')), 'count']],
    })
        .then(data => {
            if (data == null) {
                return emptyDataResponse(res, 'Evaluation not found...')
            } else {
                return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
            }
        })
        .catch(err => errResponse(res, err))
}
