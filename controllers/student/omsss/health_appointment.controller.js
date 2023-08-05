// ? ======================================================================
// ? HEALTH APPOINTMENT CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const moment = require('moment-timezone')

// % View All Appointments (na Pending at Approved) from the currently logged in user.
// % ROUTE: /mypupqc/v1/omsss/student/view_all_user_appointments (GET)
exports.viewAllUserAppointments = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // * Get the last consultation date of the student
    const lastConsultationDate = await db.Health_Appointment.max('consultation_date', {
        where: {
            user_id: req.user.user_id,
            consultation_status: {
                [Op.or]: ['Pending', 'Cancelled by Staff', 'Cancelled by Student', 'Approved'],
            },
        },
    })

    const user_id = req.user.user_id
    db.Health_Appointment.findAll({
        where: {
            user_id: user_id,
            consultation_status: {
                [Op.or]: ['Pending', 'Approved', 'Cancelled by Staff', 'Cancelled by Student'],
            },
            consultation_date: {
                [Op.between]: [new Date(), lastConsultationDate],
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

// % View All Medical Appointments (na Pending at Approved) (Student -> Specific)
// % ROUTE: /mypupqc/v1/omsss/student/view_medical_appointment (GET)
exports.viewMedicalAppointment = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // * Get the last consultation date of the student
    let lastConsultationDate = await db.Health_Appointment.max('consultation_date', {
        where: {
            user_id: req.user.user_id,
            appointment_type: 'Medical',
            consultation_status: {
                [Op.or]: ['Pending', 'Cancelled by Staff', 'Cancelled by Student', 'Approved'],
            },
        },
    })

    let today = moment.utc().startOf('day')

    lastConsultationDate = moment.utc(lastConsultationDate).startOf('day')

    let betweenValue =
        lastConsultationDate.toDate() == 'Invalid Date'
            ? [today.toDate(), today.toDate()]
            : [today.toDate(), lastConsultationDate.toDate()]

    const user_id = req.user.user_id
    db.Health_Appointment.findAll({
        where: {
            user_id: user_id,
            appointment_type: 'Medical',
            consultation_status: {
                [Op.or]: ['Pending', 'Approved', 'Cancelled by Staff', 'Cancelled by Student'],
            },
            consultation_date: {
                [Op.between]: betweenValue,
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
                'Medical appointments have been retrieved',
                'Medical appointments have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View All Dental Appointments (na Pending at Approved) (Student -> Specific)
// % ROUTE: /mypupqc/v1/omsss/student/view_dental_appointment (GET)
exports.viewDentalAppointment = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // * Get the last consultation date of the student
    let lastConsultationDate = await db.Health_Appointment.max('consultation_date', {
        where: {
            user_id: req.user.user_id,
            appointment_type: 'Dental',
            consultation_status: {
                [Op.or]: ['Pending', 'Cancelled by Staff', 'Cancelled by Student', 'Approved'],
            },
        },
    })

    let today = moment.utc().startOf('day')

    lastConsultationDate = moment.utc(lastConsultationDate).startOf('day')

    let betweenValue =
        lastConsultationDate.toDate() == 'Invalid Date'
            ? [today.toDate(), today.toDate()]
            : [today.toDate(), lastConsultationDate.toDate()]

    const user_id = req.user.user_id
    db.Health_Appointment.findAll({
        where: {
            user_id: user_id,
            appointment_type: 'Dental',
            consultation_status: {
                [Op.or]: ['Pending', 'Approved', 'Cancelled by Staff', 'Cancelled by Student'],
            },
            consultation_date: {
                [Op.between]: betweenValue,
            },
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
                'Dental appointments have been retrieved',
                'Dental appointments have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View All Guidance Appointments (na Pending at Approved) (Student -> Specific)
// % ROUTE: /mypupqc/v1/omsss/student/view_guidance_appointment (GET)
exports.viewGuidanceAppointment = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // * Get the last consultation date of the student
    let lastConsultationDate = await db.Health_Appointment.max('consultation_date', {
        where: {
            user_id: req.user.user_id,
            appointment_type: 'Guidance',
            consultation_status: {
                [Op.or]: ['Pending', 'Cancelled by Staff', 'Cancelled by Student', 'Approved'],
            },
        },
    })

    let today = moment.utc().startOf('day')

    lastConsultationDate = moment.utc(lastConsultationDate).startOf('day')

    let betweenValue =
        lastConsultationDate.toDate() == 'Invalid Date'
            ? [today.toDate(), today.toDate()]
            : [today.toDate(), lastConsultationDate.toDate()]

    const user_id = req.user.user_id
    db.Health_Appointment.findAll({
        where: {
            user_id: user_id,
            appointment_type: 'Guidance',
            consultation_status: {
                [Op.or]: ['Pending', 'Approved', 'Cancelled by Staff', 'Cancelled by Student'],
            },
            consultation_date: {
                [Op.between]: betweenValue,
            },
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
                'Guidance appointments have been retrieved',
                'Guidance appointments have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Appointment (based on appointment_id)
// % ROUTE: /mypupqc/v1/omsss/student/view_appointment/:appointment_id (GET)
exports.viewSpecificAppointment = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id
    const appointment_id = req.params.appointment_id

    db.Health_Appointment.findOne({
        where: {
            user_id: user_id,
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

// % Add Appointments
// % ROUTE: /mypupqc/v1/omsss/student/add_appointment (POST)
exports.addAppointment = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const numberOfAppointments = await db.Health_Appointment.count({
        where: {
            user_id: req.user.user_id,
            appointment_type: req.body.appointment_type,
            consultation_status: {
                [Op.or]: ['Pending', 'Approved'],
            },
        },
    })

    if (numberOfAppointments >= 1) {
        return errResponse(
            res,
            'Existing appointment was found! You can only have 1 appointment at a time. You may cancel your existing appointment to add a new one.'
        )
    }

    const user_id = req.user.user_id
    req.body['user_id'] = user_id
    req.body['remarks'] =
        "You can refresh this page to see the status of your appointment. If you don't see any changes, please contact the staff."

    db.Health_Appointment.create(req.body)
        .then(data => {
            db.Health_Appointment.findOne({
                where: { health_appointment_id: data.health_appointment_id },
            })
                .then(data => {
                    dataResponse(
                        res,
                        data,
                        'Appointment has been created',
                        'Appointment has not been created'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Set Appointment to Cancel
// % ROUTE: /mypupqc/v1/omsss/student/cancel_appointment (PUT)
exports.cancelAppointment = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id
    const appointment_id = req.params.appointment_id

    db.Health_Appointment.update(
        { consultation_status: 'Cancelled by Student', remarks: 'Cancelled by Student' },
        {
            where: {
                user_id: user_id,
                health_appointment_id: appointment_id,
            },
        }
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
                            'Appointment has been cancelled',
                            'Appointment has not been cancelled'
                        )
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Appointment Logs that are Cancelled or Done
// % ROUTE: /mypupqc/v1/omsss/student/appointment_logs (GET)
exports.viewAppointmentLogs = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Health_Appointment.findAll({
        where: {
            user_id: user_id,
            consultation_status: {
                [Op.or]: ['Done', 'Cancelled by Student', 'Cancelled by Staff'],
            },
            consultation_date: {
                // >> assumes that the date is in the past beyond (today <= consultation_date)
                // >> Example: today = 2020-10-10, consultation_date = 2020-10-09
                // >> 2020-10-10 <= 2020-10-09, 2020-10-08, 2020-10-07, etc.
                [Op.lte]: new Date(),
            },
        },
        include: [
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
                'Appointment logs have been retrieved',
                'Appointment logs have not been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}
