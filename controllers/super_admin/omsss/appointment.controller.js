// ? ======================================================================
// ? APPOINTMENT CONTROLLER - SUPER ADMIN
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % View All Appointments except with the Done status.
// % ROUTE: mypupqc/v1/super_admin/omsss/view_appointments_except_done
exports.viewAllAppointmentsExceptDone = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.findAll({
        where: {
            consultation_status: {
                [Op.not]: ['Done'],
            },
        },
        include: [
            {
                model: db.User,
                as: 'health_appointment_assigned_to_user',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        seperate: true,
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
            {
                model: db.User,
                as: 'health_appointment_assigned_to_physician',
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
            dataResponse(
                res,
                data,
                'Appointments have been retrieved',
                'Appointments have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View All Appointments with the Done status.
// % ROUTE: mypupqc/v1/super_admin/omsss/view_done_appointments
exports.viewAllDoneAppointments = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.findAll({
        where: {
            consultation_status: 'Done',
        },
        include: [
            {
                model: db.User,
                as: 'health_appointment_assigned_to_user',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        seperate: true,
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
            {
                model: db.User,
                as: 'health_appointment_assigned_to_physician',
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
            dataResponse(
                res,
                data,
                'Appointments have been retrieved',
                'Appointments have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Appointment
// % ROUTE: mypupqc/v1/super_admin/omsss/view_appointment/:appointment_id
exports.viewSpecificAppointment = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const appointment_id = req.params.appointment_id

    db.Health_Appointment.findOne({
        where: {
            health_appointment_id: appointment_id,
        },
        include: [
            {
                model: db.User,
                as: 'health_appointment_assigned_to_user',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        separate: true,
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: [
                            'full_name',
                            'full_address',
                            'email_address',
                            'contact_number',
                            'birth_date',
                            'gender',
                            'civil_status',
                        ],
                    },
                ],
            },
            {
                model: db.User,
                as: 'health_appointment_assigned_to_physician',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        separate: true,
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: [
                            'full_name',
                            'full_address',
                            'email_address',
                            'contact_number',
                            'birth_date',
                            'gender',
                            'civil_status',
                        ],
                    },
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Appointment has been retrieved',
                'Appointment has not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Set Appointment Status to Deleted based on params
// % ROUTE: mypupqc/v1/super_admin/omsss/delete_appointment/:appointment_id
exports.deleteAppointment = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const appointment_id = req.params.appointment_id
    db.Health_Appointment.update(
        { consultation_status: 'Deleted', remarks: 'Deleted by Super Admin' },
        { where: { health_appointment_id: appointment_id } }
    )
        .then(data => {
            if (data[0] == 1) {
                db.Health_Appointment.findOne({
                    where: { health_appointment_id: appointment_id },
                    attributes: [
                        'health_appointment_id',
                        'case_control_number',
                        'consultation_status',
                        'remarks',
                    ],
                })
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'Appointment has been deleted',
                            'Appointment has not been deleted'
                        )
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}
