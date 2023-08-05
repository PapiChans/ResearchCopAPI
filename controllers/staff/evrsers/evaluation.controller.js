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

// % View All Evaluation
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_evaluation/ (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Evaluation.findAll({
        include: [
            'reservation_evaluations',
            {
                model: db.User,
                as: 'evrsers_evaluation_user',
                include: ['user_profiles'],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Evaluation
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_evaluation/:evaluation_id (GET)
exports.viewSpecificEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const evaluation_id = req.params.evaluation_id

    db.Reservation_Evaluation.findByPk(evaluation_id, {
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
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        })
        .catch(err => errResponse(res, err))
}
