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

// % Analytics: Evaluation of EVRSERS (Average of Ratings) for the Current Year
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/evaluation_analytics/total_average_rating (GET)
exports.evaluationAnalyticsTotalAverageRating = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const currentYear = new Date().getFullYear()
    db.Reservation_Evaluation.findAll({
        where: {
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

// % Analytics: Number of Evaluated Appointments of EVRSERS for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/evaluation_analytics/average_rating_of_evaluated_appointments (GET)
exports.evaluationAnalyticsAverageRatingOfEvaluatedAppointments = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const currentYear = new Date().getFullYear()
    db.Reservation_Evaluation.findAll({
        where: {
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

// % Analytics: Number of Evaluated Appointments of EVRSERS for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/evaluation_analytics/number_of_is_evaluated_by_consultation_type (GET)
exports.evaluationCountByDone = (req, res) => {
  let v = checkAuthorization(req, res, 'PUP Staff')
  if (v != null) return v

  db.Reservation.findAll({
    where: {
      is_evaluated: true,
    },
    attributes: [
      [
        db.sequelize.fn('COUNT', db.sequelize.col('is_evaluated')),
        'number_of_evaluated_reservations',
      ],
    ],
  })
  .then(data => {
    if (data == null) {
      return emptyDataResponse(res, 'Evaluation not found...')
    } else {
      return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
    }
  })
}
