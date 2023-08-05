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
var Sequelize = require('sequelize');

require('dotenv').config()


// % View All approved status Reservation
// % ROUTE: /mypupqc/v1/evrsers/student/view_approved_reservation
exports.viewApprovedReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'Approved & Released',
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
                attributes: ['facility_name'],
            },
            {
                model: db.ReservationPubmats,
                as: 'ReservationPubmats',
                attributes: ['pubmats_images'],
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: [
                    [Sequelize.literal(`CASE WHEN char_length(organization_abbreviation) = 0 THEN organization_name ELSE organization_abbreviation END`), 'display_name']
                ],
            },
        ],
    })
        .then(data => {
            console.log(data)
            dataResponse(
                res,
                data,
                'A Reservation has been found.',
                'No Reservation has been found.'
            )
        })
        .catch(err => errResponse(res, err))
}


// % View specific reservation with pubmats
// % ROUTE: /mypupqc/v1/evrsers/student/view_specific_reservation/:reservation_id
exports.viewSpecificReservationStudent = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Reservation.findOne({
        where: {
            reservation_id: req.params.reservation_id,
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
                attributes: ['facility_name'],
            },
            {
                model: db.ReservationPubmats,
                as: 'ReservationPubmats',
                attributes: ['pubmats_images'],
            },
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'A Reservation has been found.',
                'No Reservation has been found.'
            )
        })
        .catch(err => errResponse(res, err))
}
