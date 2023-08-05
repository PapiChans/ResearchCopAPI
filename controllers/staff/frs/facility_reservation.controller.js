// ? ======================================================================
// ? FACILITY RESERVATION CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View All Facility Reservation
// % ROUTE: /mypupqc/v1/frs/pup_staff/view/facility_reservation
exports.viewAllFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.FacilityReservation.findAll({
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
    })
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
// % ROUTE: /mypupqc/v1/frs/pup_staff/view/facility_reservation/:facility_reservation_id
exports.viewSpecificFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
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

// % Change Facility Reservation Status
// % ROUTE: /mypupqc/v1/frs/pup_staff/change/facility_reservation_status/:facility_reservation_id
exports.changeStatusFacilityReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.FacilityReservation.update(req.body, {
        where: { facility_reservation_id: req.params.facility_reservation_id },
    }).then(data => {
        if (data[0] == 1) {
            dataResponse(res, data, 'Facility Reservation status was successfully updated!')
        } else {
            emptyDataResponse(res, 'Facility Reservation status was not updated!')
        }
    })
}
