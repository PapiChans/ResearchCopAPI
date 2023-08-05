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
// % ROUTE: /mypupqc/v1/omsss/student/view_evaluation/:appointment_id (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const health_appointment_id = req.params.appointment_id

    db.Health_Appointment_Evaluation.findOne({
        where: {
            health_appointment_id: health_appointment_id,
        },
        include: [
            {
                model: db.Health_Appointment,
                as: 'health_appointment_evaluation',
                attributes: [
                    'case_control_number',
                    'consultation_type',
                    'consultation_reason',
                    'consultation_date',
                ],
            },
            {
                model: db.User,
                as: 'health_appointment_evaluation_user',
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
            {
                model: db.User,
                as: 'health_appointment_evaluation_physician',
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
            if (data) {
                return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
            } else {
                return emptyDataResponse(res, 'Evaluation not found...')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Add Evaluation
// % ROUTE: /mypupqc/v1/omsss/student/add_evaluation/:appointment_id (POST)
exports.addEvaluation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const isDone = await db.Health_Appointment.findOne({
        where: {
            health_appointment_id: req.params.appointment_id,
            consultation_status: 'Done',
        },
    })
        .then(data => {
            if (data) {
                req.body.attending_physician = data.attending_physician
                return true
            } else return false
        })
        .catch(err => errResponse(res, err))

    if (!isDone) {
        return errResponse(res, err)
    }

    req.body.evaluation_date = new Date()
    req.body.health_appointment_id = req.params.appointment_id
    req.body.user_id = req.user.user_id
    req.body.quality_rating = parseInt(req.body.quality_rating)
    req.body.timeliness_rating = parseInt(req.body.timeliness_rating)
    req.body.courtesy_rating = parseInt(req.body.courtesy_rating)

    let average =
        [req.body.quality_rating, req.body.timeliness_rating, req.body.courtesy_rating].reduce(
            (partialSum, a) => partialSum + a,
            0
        ) / 3
    average = Math.round(average * 1000) / 1000
    req.body.average_rating = average

    console.log(req.body)

    db.Health_Appointment_Evaluation.create(req.body)
        .then(evaluationData => {
            if (evaluationData) {
                db.Health_Appointment.update(
                    { is_evaluated: true },
                    {
                        where: {
                            health_appointment_id: req.params.appointment_id,
                        },
                    }
                ).then(data => {
                    if (data) {
                        return dataResponse(
                            res,
                            evaluationData,
                            'Evaluation added',
                            'Evaluation not added...'
                        )
                    } else {
                        return emptyDataResponse(res)
                    }
                })
            } else {
                return emptyDataResponse(res)
            }
        })
        .catch(err => errResponse(res, err))
}
