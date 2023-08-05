// ? ======================================================================
// ? EVENT RESERVATION CONTROLLER - PUP STAFF
// ? ======================================================================

// Import required packages
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

require('dotenv').config()

// >> Send an Update to User's Email about the Reservation Status
function sendReservationStatusUpdateEmail(res, data) {
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }
    const email_address = data.user_assigned_to_reservation.user_profiles[0].email_address
    const reserve_status = data.reserve_status
    const reservation_number = data.reservation_number
    const first_name = data.user_assigned_to_reservation.user_profiles[0].first_name

    const all_data = {
        data: data,
    }

    let transporter = nodemailer.createTransport(mg(auth))

    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: email_address,
            subject: `[Reservation #${reservation_number}] ${reserve_status}`,
            text: `Hello ${first_name}, your reservation has been updated to ${reserve_status}.`,
            html: `<h1>Hello ${first_name},</h1> <p>your reservation has been updated to ${reserve_status}.</p>`,
        },
        (err, info) => {
            if (err) {
                console.log(err)
                errResponse(res, 'Reservation update email not sent.')
            } else {
                all_data['email_status'] = info
                dataResponse(
                    res,
                    all_data,
                    'Reservation Status has been updated and email has been sent.',
                    'Reservation Status has been updated but email has not been sent.'
                )
            }
        }
    )
}

// % View all Reservation.
// % ROUTE: /mypupqc/v1/ems/pup_staff/view/reservation
exports.viewAllReservationHistoryStaff = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.EventReservation.findAll({
        include: [
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservation',
                attributes: ['organization_name'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_reservation',
                attributes: ['user_no'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all facilities that reserved and reserve status must be 'pending'.
// % ROUTE: /mypupqc/v1/ems/pup_staff/view/pending_reservation
exports.viewAllPendingReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.EventReservation.findAll({
        where: {
            reserve_status: 'For Review',
        },
        include: [
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservation',
                attributes: ['organization_name'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_reservation',
                attributes: ['user_no'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    }).then(data => {
        dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
    })
}

// % View all approved reservation.
// % ROUTE: /mypupqc/v1/ems/pup_staff/view/approved_reservation
exports.viewAllApprovedReservationStaff = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.EventReservation.findAll({
        where: {
            reserve_status: 'Approved & Released',
        },
        include: [
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservation',
                attributes: ['organization_name'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_reservation',
                attributes: ['user_no'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
            {
                model: db.EventSignatory,
                as: 'event_reservation_signatories',
            },
        ],
    }).then(data => {
        dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
    })
}

// % View specific details the event.
// % ROUTE: /mypupqc/v1/ems/pup_staff/view/reservation/:reservation_id
exports.viewSpecificReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.EventReservation.findOne({
        where: {
            reservation_id: req.params.reservation_id,
        },
        include: [
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservation',
                attributes: ['organization_name'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_reservation',
                attributes: ['user_no'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
            {
                model: db.EventSignatory,
                as: 'event_reservation_signatories',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Signatories of a Reservation
// % ROUTE: /mypupqc/v1/ems/pup_staff/reservation_signatories/:reservation_id
exports.viewAllSignatories = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.EventSignatory.findAll({
        where: {
            reservation_id: req.params.reservation_id,
        },
        include: [
            {
                model: db.EventReservation,
                as: 'event_reservation_signatory',
                attributes: ['reservation_number', 'event_title'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_event_reservation_signatory',
                attributes: ['user_no', 'user_type'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Edit a Reservation Status based on the [:reservation_id] parameter.
// % ROUTE: /mypupqc/v1/ems/pup_staff/reservation/status/:reservation_id
exports.editReservationStatus = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const reserveInfoBody = {
        reserve_status: req.body.reserve_status,
        remarks: req.body.remarks,
    }

    db.EventReservation.update(reserveInfoBody, {
        where: { reservation_id: req.params.reservation_id },
    })
        .then(result => {
            if (result == 1) {
                db.EventReservation.findOne({
                    where: { reservation_id: req.params.reservation_id },
                    include: [
                        {
                            model: db.Organization,
                            as: 'organization_assigned_to_reservation',
                            attributes: ['organization_name'],
                        },
                        {
                            model: db.User,
                            as: 'user_assigned_to_reservation',
                            attributes: ['user_no'],
                            include: [
                                {
                                    model: db.UserProfile,
                                    as: 'user_profiles',
                                    attributes: ['first_name'],
                                },
                            ],
                        },
                    ],
                }).then(resultData => {
                    sendReservationStatusUpdateEmail(res, resultData)
                })
            } else errResponse(res, 'Error in updating Reservation Status')
        })
        .catch(err => errResponse(res, err))
}
