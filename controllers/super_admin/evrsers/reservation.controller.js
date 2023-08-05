// ? ======================================================================
// ? RESERVATION CONTROLLER
// ? This controller is for querying Super Admin related information.
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

// % View all reservations except DONE Status
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_list_reservation
exports.viewListReservations = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: {
                [Op.or]: [
                    'For Review',
                    'Cancelled by Staff',
                    'Cancelled by Student',
                    'Deleted',
                    'For Evaluation / Processing',
                    'Approved & Released',
                    'For Revision',
                ],
            },
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

// % View all Reservation with DONE Status
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_done
exports.viewAllDoneReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'Done',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Soft deletes a reservation
// % ROUTE: /mypupqc/v1/evrsers/super_admin/delete_reservation/:reservation_id
exports.deleteReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.update(
        {
            reserve_status: 'Deleted',
        },
        {
            where: {
                reservation_id: req.params.reservation_id,
            },
        }
    )
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Reservation
// % ROUTE: /mypupqc/v1/evrsers/student/view_reservation/:reservation_id
exports.viewAdminSpecificReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
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
                model: db.Reservation_Signatory,
                as: 'reservation_assigned_to_reservation_signatory',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All For Review Reservation
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_pending
exports.viewAllPendingReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
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
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Approved Reservation
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_approved
exports.viewAllApprovedReservationAdmin = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
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
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all `For Evaluation / Processing` reservations.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_for_evaluation
exports.viewAllForEvaluationReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            reserve_status: 'For Evaluation / Processing',
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
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_cancelled
exports.viewAllCancelledReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            [Op.or]: [
                { reserve_status: 'Cancelled by Staff' },
                { reserve_status: 'Cancelled by Staff' },
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

// % View all `Done` reservations.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_done
exports.viewAllDoneReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
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
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}
