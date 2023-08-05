// ? ======================================================================
// ? HEALTH APPOINTMENT CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const roles_in_omsss = ['Doctor', 'Dentist', 'Guidance Counsellor']

// * dotenv config
require('dotenv').config()

// >> Send An Update to the User's Email Address regarding the Appointment
// >> whether if it is Approved or Cancelled by Staff
function sendAppointmentUpdateEmail(res, data) {
    // configure Mailgun transport
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }

    const email_address = data.health_appointment_assigned_to_user.user_profiles[0].email_address
    const case_control_number = data.case_control_number
    const appointment_type = data.appointment_type
    const appointment_status = data.consultation_status

    const all_data = {
        data: data,
    }

    let transporter = nodemailer.createTransport(mg(auth))

    // send mail with defined transport object
    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: 'mypupqc@gmail.com',
            subject: `Your ${appointment_type} Appointment (${case_control_number}) has been ${appointment_status}`,
            text: `Your ${appointment_type} Appointment (${case_control_number}) has been ${appointment_status}`,
            html: `<p>Your ${appointment_type} Appointment (${case_control_number}) has been ${appointment_status}</p>`, // html body
        },
        (err, info) => {
            if (err) {
                console.log(`Error: ${err}`)
                errResponse(res, 'Appointment update email not sent.')
            } else {
                all_data['email_status'] = info
                dataResponse(
                    res,
                    all_data,
                    'Appointment updated successfully and email update successfully sent.',
                    'Appointment update not successful, email not sent.'
                )
            }
        }
    )
}

// % View Pending and Approved Appointments Based on Appointment Type provided by the Frontend through params
// % ROUTE: /omsss/pup_staff/view_pending_appointment/:appointment_type
exports.viewAllPendingAppprovedAppointmentBasedOnType = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    let appointment_type = req.params.appointment_type // * ['Medical', 'Dental', 'Guidance']

    if (!roles_in_omsss.some(role => req.user.user_roles.includes(role)))
        return res.status(401).send('Oops! You are unauthorized to view your request')

    db.Health_Appointment.findAll({
        where: {
            appointment_type: appointment_type,
            consultation_status: {
                [Op.or]: ['Pending', 'Approved'],
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
                `${appointment_type} appointments have been retrieved`,
                `${appointment_type} appointments have not been retrieved`
            )
        })
        .catch(err => errResponse(res, err))
}

exports.viewAppointmentAnalytics = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    if (!roles_in_omsss.some(role => req.user.user_roles.includes(role)))
        return res.status(401).send('Oops! You are unauthorized to view your request')

    let appointment_type = req.params.appointment_type // * ['Medical', 'Dental', 'Guidance']

    db.Health_Appointment.findAll({
        where: {
            consultation_status: {
                [Op.or]: ['Done', 'Cancelled by Staff', 'Cancelled by Student'],
            },
            appointment_type: appointment_type,
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
                `${appointment_type} appointments have been retrieved`,
                `${appointment_type} appointments have not been retrieved`
            )
        })
        .catch(err => errResponse(res, err))
}

exports.viewSpecificAppointment = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    let appointment_id = req.params.appointment_id

    if (!roles_in_omsss.some(role => req.user.user_roles.includes(role)))
        return res.status(401).send('Oops! You are unauthorized to view your request')

    db.Health_Appointment.findOne({
        where: { health_appointment_id: appointment_id },
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

// % View the Medical History of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/pup_staff/medical_history/:user_id (GET)
exports.viewMedicalHistory = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.params.user_id

    db.Medical_History.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data == null) {
                // >> Ayun kapag wala ulit data, gawa and then
                // >> return the data na nagawa.

                const addPatientInfo = {
                    user_id: user_id,
                }

                db.Medical_History.create(addPatientInfo)
                    .then(data => {
                        db.Medical_History.findOne({
                            where: { user_id: user_id },
                        })
                            .then(data => {
                                dataResponse(
                                    res,
                                    data,
                                    'Medical History has been created',
                                    'Medical History has not been created'
                                )
                            })
                            .catch(err => errResponse(res, err))
                    })
                    .catch(err => errResponse(res, err))
            } else {
                dataResponse(
                    res,
                    data,
                    'Medical History has been retrieved',
                    'Medical History has not been retrieved'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// % View Patient Information of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/pup_staff/patient_information/:user_id (GET)
exports.viewPatientInformation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.params.user_id

    db.Patient_Information.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data == null) {
                // >> Goal: Gusto ko makuha yung user_id ng user para magkaroon na
                // >> siya ng sariling patient_information_id secretly sa database.
                // >> if meron na, get na lang para ma populate sa input boxes.

                const addPatientInfo = {
                    user_id: user_id,
                }

                db.Patient_Information.create(addPatientInfo)
                    .then(data => {
                        // Kapag nag create na ng patient information kailangan kunin
                        // ko rin yung data ng email_address at contact_number
                        // para mapopulate naman sa respective input boxes nila.
                        db.Patient_Information.findOne({
                            where: { user_id: user_id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient_info_assigned_to_user',
                                    // attributes: ['user_id', 'user_no', 'user_type'],
                                    include: [
                                        {
                                            model: db.UserProfile,
                                            as: 'user_profiles',
                                        },
                                    ],
                                },
                            ],
                        })
                            .then(data => {
                                dataResponse(
                                    res,
                                    data,
                                    'Patient Information has been created',
                                    'Patient Information has not been created'
                                )
                            })
                            .catch(err => errResponse(res, err))
                    })
                    .catch(err => errResponse(res, err))
            } else {
                dataResponse(
                    res,
                    data,
                    'Patient Information has been retrieved',
                    'Patient Information has not been retrieved'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// % View the Immunization Record of the student.
// % ROUTE: /mypupqc/v1/omsss/pup_staff/view_immunization (GET)
exports.viewImmunization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.params.user_id

    db.Immunization.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => {
            errResponse(res, err)
        })
}

exports.updateStatus = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    if (!roles_in_omsss.some(role => req.user.user_roles.includes(role)))
        return res.status(401).send('Oops! You are unauthorized to view your request')

    let appointment_id = req.params.appointment_id
    req.body.attending_physician = req.user.user_id

    db.Health_Appointment.findOne({
        where: { health_appointment_id: appointment_id },
    })
        .then(data => {
            if (data == null) return errResponse(res, 'No Appointment found.')

            db.Health_Appointment.update(req.body, {
                where: { health_appointment_id: appointment_id },
            })
                .then(data => {
                    if (data[0] == 1) {
                        db.Health_Appointment.findOne({
                            where: { health_appointment_id: appointment_id },
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
                                            attributes: ['email_address'],
                                        },
                                    ],
                                },
                            ],
                        })
                            .then(data => {
                                sendAppointmentUpdateEmail(res, data)
                            })
                            .catch(err => errResponse(res, err))
                    }
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}
