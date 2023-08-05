// ? ======================================================================
// ? FACILITY RESERVATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % Add Facility Reservation
// % ROUTE: /mypupqc/v1/frs/student/add/facility_reservation
exports.reserveFacility = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    req.body.user_id = user_id

    console.log(req.body)

    db.FacilityReservation.create(req.body)
        .then(data => {
            dataResponse(
                res,
                data,
                'A facility reservation was successfully created!',
                'Failed to create a facility reservation!'
            )
        })
        .catch(err => errResponse(res, err))
}

// % View All Facility Reservation
// % ROUTE: /mypupqc/v1/frs/student/view/facility_reservation
exports.viewAllFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.FacilityReservation.findAll(
        {
            where: { user_id: req.user.user_id },
        },
        {
            include: [
                {
                    model: db.Facilities,
                    as: 'facilities_assigned_to_facility_reservation',
                    attributes: ['facility_id', 'facility_name', 'facility_picture'],
                },
                {
                    model: db.User,
                    as: 'user_assigned_to_facility_reservation',
                    attributes: ['user_id', 'user_no'],
                    include: [
                        {
                            model: db.UserProfile,
                            as: 'user_profiles',
                            attributes: ['full_name'],
                        },
                    ],
                },
            ],
        }
    )
        .then(data => {
            if (data) {
                dataResponse(
                    res,
                    data,
                    'Facility Reservation records are retrieved successfully!',
                    'No Facility Reservation records are found!'
                )
            } else {
                emptyDataResponse(res, 'No Facility Reservation records are found!')
            }
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Facility Reservation
// % ROUTE: /mypupqc/v1/frs/student/view/facility_reservation/:reservation_id
exports.viewSpecificFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.FacilityReservation.findOne({
        where: { facility_reservation_id: req.params.facility_reservation_id },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_facility_reservation',
                attributes: ['facility_id', 'facility_name', 'facility_picture'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_facility_reservation',
                attributes: ['user_id', 'user_no'],
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
        if (data) {
            dataResponse(res, data, 'A facility reservation was successfully retrieved!')
        } else {
            emptyDataResponse(res, 'No facility reservation was retrieved!')
        }
    })
}

// % Edit Facility Reservation
// % ROUTE: /mypupqc/v1/frs/student/edit/facility_reservation/:reservation_id
exports.editFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    req.body.user_id = user_id
    req.body.reserve_status = 'For Review'

    console.log(req.body)

    db.FacilityReservation.update(req.body, {
        where: {
            facility_reservation_id: req.params.facility_reservation_id,
            reserve_status: 'For Revision',
        },
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'A facility reservation was successfully updated!',
                'Failed to update a facility reservation!'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Cancel Facility Reservation
// % ROUTE: /mypupqc/v1/frs/student/cancel/facility_reservation/:reservation_id
exports.cancelFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.FacilityReservation.update(
        { reserve_status: 'Cancelled by Student' },
        {
            where: {
                facility_reservation_id: req.params.facility_reservation_id,
            },
        }
    )
        .then(data => {
            dataResponse(
                res,
                data,
                'A facility reservation was successfully cancelled!',
                'Failed to cancel a facility reservation!'
            )
        })
        .catch(err => errResponse(res, err))
}
