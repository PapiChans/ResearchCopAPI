// ? ======================================================================
// ? EVALUATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % View Evaluation
// % ROUTE: /mypupqc/v1/evrsers/student/view_evaluation/:reservation_id (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const reservation_id = req.params.reservation_id

    db.Reservation_Evaluation.findOne({
        where: {
            reservation_id: reservation_id,
        },
        include: [
            {
                model: db.Reservation,
                as: 'reservation_evaluations',
                attributes: [
                    'reservation_id',
                    'reservation_number',
                    'time_from',
                    'time_to',
                    'event_title',
                    'reserve_date',
                    'reserve_status',
                ],
            },
            {
                model: db.User,
                as: 'evrsers_evaluation_user',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        separate: true,
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ]
    })
        .then(data => {
                if (data) {
                    return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
                } else {
                    return emptyDataResponse(res, 'Evaluation not found...')
                }
            })
            .catch(err => errResponse(res, err))
}

// % Add Evaluation
// % ROUTE: /mypupqc/v1/evrsers/student/add_evaluation/:reservation_id (POST)
exports.addEvaluation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const reservation_id = req.params.reservation_id

    const evalData = {
        reservation_id: reservation_id,
        user_id: req.user.user_id,
        evaluation_date: new Date(),
        quality_rating: req.body.quality_rating,
        timeliness_rating: req.body.timeliness_rating,
        courtesy_rating: req.body.courtesy_rating,
        average_rating: calculateAverageRating(
            req.body.quality_rating,
            req.body.timeliness_rating,
            req.body.courtesy_rating
        ),
        evaluation_comment: req.body.evaluation_comment,
    }

    db.Reservation_Evaluation.create(evalData)
        .then(data => {
            db.Reservation.update(
                {
                    is_evaluated: true,
                },
                {
                    where: {
                        reservation_id: reservation_id,
                    },
                }
            )
                .then(result => {
                    if (result == 1) {
                        return dataResponse(
                            res,
                            data,
                            'Evaluation added',
                            'Evaluation not added...'
                        )
                    } else {
                        return errResponse(res, 'Evaluation not added...')
                    }
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

function calculateAverageRating(quality_rating, timeliness_rating, courtesy_rating) {
    let average =
        [+quality_rating, +timeliness_rating, +courtesy_rating].reduce(
            (partialSum, a) => partialSum + a,
            0
        ) / 3
    average = Math.round(average * 1000) / 1000
    return average
}