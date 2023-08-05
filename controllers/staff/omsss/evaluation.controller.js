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

// % View Evaluation of Current Attending Physician
// % ROUTE: /mypupqc/v1/omsss/pup_staff/view_evaluation/ (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Health_Appointment_Evaluation.findAll({
        where: {
            attending_physician: user_id,
        },
        include: [
            {
                model: db.Health_Appointment,
                as: 'health_appointment_evaluation',
                attributes: ['case_control_number'],
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
            if (data == null) {
                return emptyDataResponse(res, 'Evaluation not found...')
            } else {
                return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
            }
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Evaluation of Current Attending Physician
// % ROUTE: /mypupqc/v1/omsss/pup_staff/view_evaluation/:evaluation_id (GET)
exports.viewSpecificEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id
    const evaluation_id = req.params.evaluation_id

    db.Health_Appointment_Evaluation.findOne({
        where: {
            attending_physician: user_id,
            evaluation_id: evaluation_id,
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
            if (data == null) {
                return emptyDataResponse(res, 'Evaluation not found...')
            } else {
                return dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
            }
        })
        .catch(err => errResponse(res, err))
}
