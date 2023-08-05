// ? ======================================================================
// ? RESERVATION CONTROLLER
// ? This controller is for querying Student related information.
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

// % View all facilities that reserved and reserve status must be 'pending'.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_list_reservation
exports.viewAllPendingReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'For Review',
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
        ],
    }).then(data => {
        dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
    })
}

// % View all approved reservation.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_approved_reservation
exports.viewAllApprovedReservationStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'Approved & Released',
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
        ],
    }).then(data => {
        dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
    })
}

// % View specific details the event.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_details_reservation/:reservation_id
exports.viewDetailsReservationStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findOne({
        where: {
            reservation_id: req.params.reservation_id,
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: [
                    [
                        db.Sequelize.literal(
                            `CASE WHEN char_length(organization_abbreviation) = 0 THEN organization_name ELSE organization_abbreviation END`
                        ),
                        'display_name',
                    ],
                ],
            },
            {
                model: db.Reservation_Signatory,
                as: 'reservation_signatories',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Signatories of a Reservation
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_all_signatories/:reservation_id
exports.viewAllSignatoriesStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.findAll({
        where: {
            reservation_id: req.params.reservation_id,
        },
        include: [
            {
                model: db.Reservation,
                as: 'assigned_reservation',
                attributes: ['reservation_number', 'event_title'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_reservation_signatory',
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

// % View all Reservation except with done status.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_done
exports.viewAllReservationHistoryStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            [Op.or]: [
                { reserve_status: 'For Review' },
                { reserve_status: 'For Evaluation / Processing' },
                { reserve_status: 'Approved & Released' },
                { reserve_status: 'Deleted' },
                { reserve_status: 'For Revision' },
            ],
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all `For Evaluation / Processing` and `For Revision` reservations.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_for_evaluation
exports.viewAllForEvaluationReservationStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            [Op.or]: [
                { reserve_status: 'For Evaluation / Processing' },
                { reserve_status: 'For Revision' },
            ],
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all `Cancelled` reservations.
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_cancelled
exports.viewAllCancelledReservationStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            [Op.or]: [
                { reserve_status: 'Cancelled by Staff' },
                { reserve_status: 'Cancelled by Student' },
            ],
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: [
                    [
                        db.Sequelize.literal(
                            `CASE WHEN char_length(organization_abbreviation) = 0 THEN organization_name ELSE organization_abbreviation END`
                        ),
                        'display_name',
                    ],
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all `Done` reservations
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_done
exports.viewAllDoneReservationStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'Done',
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: [
                    [
                        db.Sequelize.literal(
                            `CASE WHEN char_length(organization_abbreviation) = 0 THEN organization_name ELSE organization_abbreviation END`
                        ),
                        'display_name',
                    ],
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
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/edit_status/:reservation_id
exports.editReservationStatusStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const reserveInfoBody = {
        reserve_status: req.body.reserve_status,
        remarks: req.body.remarks,
    }
    db.Reservation.update(reserveInfoBody, { where: { reservation_id: req.params.reservation_id } })
        .then(result => {
            if (result == 1) {
                db.Reservation.findOne({
                    where: { reservation_id: req.params.reservation_id },
                    include: [
                        {
                            model: db.User,
                            as: 'user_assigned_to_reservation',
                            include: [
                                {
                                    seperate: true,
                                    model: db.UserProfile,
                                    as: 'user_profiles',
                                    attributes: ['first_name', 'email_address'],
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
