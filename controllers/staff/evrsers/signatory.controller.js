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

// >> [1] -> View All PUP Staff
// % View All PUP Staff available in the database for Signatory Assignment
// % ROUTE: /mypupqc/v1/pup_staff/signatory/view_all_staff
exports.viewAllPUPStaffForSignatory = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.User.findAll({
        where: {
            user_type: 'PUP Staff',
        },
        include: [
            {
                model: db.UserProfile,
                as: 'user_profiles',
                attributes: ['full_name'],
            },
        ],
        attribute: ['user_id', 'user_no', 'user_type'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// >> [2] -> Add Signatory to the Reservation
// % Add Multiple Signatories to a Reservation and Assign `Signatory_EVRSERS` role to those users
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/add_signatories/:reservation_id
exports.addSignatoriesReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    let signatories = req.body.signatories

    db.Reservation.findOne({
        where: { reservation_id: req.params.reservation_id },
    }).then(data => {
        if (data) {
            db.Reservation_Signatory.destroy({
                where: { reservation_id: req.params.reservation_id },
            })
                .then(data => {
                    const signatoryReservationData = []
                    let counter = 1
                    signatories.forEach(signatory => {
                        signatory_data = {}
                        signatory_data.user_id = signatory
                        signatory_data.reservation_id = req.params.reservation_id
                        signatory_data.hierarchy_number = counter
                        signatoryReservationData.push(signatory_data)
                        counter++
                    })
                    console.log(signatoryReservationData)
                    db.Reservation_Signatory.bulkCreate(signatoryReservationData)
                        .then(data => {
                            db.Reservation.update(
                                { reserve_status: 'For Evaluation / Processing' },
                                { where: { reservation_id: req.params.reservation_id } }
                            )
                                .then(data => {
                                    dataResponse(
                                        res,
                                        data,
                                        'Signatories has been added to the reservation',
                                        'No Record has been identified'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        })
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        } else {
            emptyDataResponse(res, 'No Record has been identified')
        }
    })
}

// >> [3] -> View All Reservations to be Signed
// % View Specific Signatory
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/signatory/view_user_to_be_signed_reservations
exports.viewReservationsToBeSigned = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Reservation_Signatory.findAll({
        where: {
            user_id: user_id,
            is_signed: false,
            is_onhold: false,
        },
        include: [
            {
                model: db.Reservation,
                as: 'assigned_reservation',
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
            if (data) {
                dataResponse(
                    res,
                    data,
                    'Currently Logged In User Reservations to be Signed been identified',
                    'No Reservation to be Signed has been identified'
                )
            } else {
                emptyDataResponse(res, 'No Record has been identified')
            }
        })
        .catch(err => errResponse(res, err))
}

// >> [4.1] -> Approve Reservations
// % Approves the reservation by signatory
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/approve_reservation/:reservation_id
exports.approveReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const numberOfSignatories = await db.Reservation_Signatory.findAll({
        where: {
            reservation_id: req.params.reservation_id,
        },
    }).then(data => {
        return data.length
    })

    const isPreviousSigned = await db.Reservation_Signatory.findAll({
        where: {
            reservation_id: req.params.reservation_id,
        },
    }).then(data => {
        let previousSignatory = null
        let currentSignatory
        data.forEach(signatory => {
            if (req.user.user_id == signatory.user_id) {
                currentSignatory = signatory
            }
        })

        data.forEach(signatory => {
            let currentSignatoryNumber = currentSignatory.hierarchy_number - 1
            if (currentSignatoryNumber == signatory.hierarchy_number) {
                previousSignatory = signatory
            }
        })
        if (previousSignatory == null) {
            console.log('siya si first hierarchy')
            return currentSignatory
        }
        if (previousSignatory.is_signed == true) {
            console.log('pirmahan mo si current signatory')
            return currentSignatory
        } else {
            // ! error
            console.log('hindi pa napirmahan si previous signatory')
            return false
        }
    })

    if (isPreviousSigned == false) {
        errResponse(res, 'Previous Signatory is not yet signed')
    }

    if (isPreviousSigned) {
        db.Reservation_Signatory.update(
            {
                is_signed: true,
                remarks: req.body.remarks,
            },
            {
                where: {
                    reservation_id: req.params.reservation_id,
                    user_id: req.user.user_id,
                },
            }
        )
            .then(data => {
                if (data[0] == 0) return errResponse(res, 'Signatory has not been approved')

                console.log('number of signatories: ', numberOfSignatories)
                console.log('current Signatory: ', isPreviousSigned)
                console.log(
                    'last signatory na ba siya?',
                    isPreviousSigned.hierarchy_number == numberOfSignatories
                )

                if (isPreviousSigned.hierarchy_number == numberOfSignatories) {
                    db.Reservation.update(
                        { reserve_status: 'Approved & Released' },
                        { where: { reservation_id: req.params.reservation_id } }
                    )
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'The reservation has been approved and released by the last signatory.',
                                'No Record has been identified'
                            )
                        })
                        .catch(err => errResponse(res, err))
                } else {
                    dataResponse(
                        res,
                        data,
                        'The reservation has been approved',
                        'No Record has been identified'
                    )
                }
            })
            .catch(err => errResponse(res, err))
    }
}

// >> [4.2] -> On Hold Reservations
// % On Hold the reservation by the Signatory
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/signatory/on_hold_reservation/:reservation_signatory_id
exports.onHoldReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.update(
        {
            is_onhold: true,
            remarks: req.body.remarks,
        },
        {
            where: {
                reservation_signatory_id: req.params.reservation_signatory_id,
            },
        }
    )
        .then(data => {
            if (data[0] == 0) return errResponse(res, 'Signatory has not been on hold')

            db.Reservation_Signatory.findByPk(req.params.reservation_signatory_id)
                .then(data => {
                    db.Reservation.update(
                        { reserve_status: 'For Revision' },
                        { where: { reservation_id: data.reservation_id } }
                    ).then(finalResult => {
                        if (finalResult[0] == 0)
                            return errResponse(res, 'Reservation has not been on hold')

                        dataResponse(
                            res,
                            finalResult,
                            'The reservation has been on hold',
                            'No Record has been identified'
                        )
                    })
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// >> [4.3] -> Revert On Hold Reservations
// % Revert On Hold the reservation by the Signatory
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/signatory/revert_onhold_reservation/:reservation_signatory_id
exports.revertOnHoldReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.update(
        {
            is_onhold: false,
            remarks: null,
        },
        {
            where: {
                reservation_signatory_id: req.params.reservation_signatory_id,
            },
        }
    )
        .then(data => {
            if (data[0] == 0) return errResponse(res, 'Signatory has not been reverted')

            db.Reservation_Signatory.findByPk(req.params.reservation_signatory_id)
                .then(data => {
                    db.Reservation.update(
                        { reserve_status: 'For Evaluation / Processing' },
                        { where: { reservation_id: data.reservation_id } }
                    ).then(finalResult => {
                        if (finalResult[0] == 0)
                            return errResponse(res, 'Reservation has not been reverted')

                        dataResponse(
                            res,
                            finalResult,
                            'The reservation has been reverted',
                            'No Record has been identified'
                        )
                    })
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// >> [5] -> View On Hold Signatories
// % View On Hold Signatories
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_user_on_hold_reservations
exports.viewUserOnHoldReservations = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.findAll({
        where: {
            user_id: req.user.user_id,
            is_onhold: true,
            is_signed: false,
        },
        include: [
            {
                model: db.Reservation,
                as: 'assigned_reservation',
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
            dataResponse(
                res,
                data,
                'The list of on hold reservations has been retrieved',
                'No Record has been identified'
            )
        })
        .catch(err => errResponse(res, err))
}

// >> [6] -> View All Approved Reservations from User
// % View All Approved Reservations from User
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_user_approved_reservations
exports.viewUserApprovedReservations = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.findAll({
        where: {
            user_id: req.user.user_id,
            is_signed: true,
        },
        include: [
            {
                model: db.Reservation,
                as: 'assigned_reservation',
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
            dataResponse(
                res,
                data,
                'The list of approved reservations has been retrieved',
                'No Record has been identified'
            )
        })
        .catch(err => errResponse(res, err))
}

// >> [O] -> View All Reservations with Signatories
// % View Specific Reservation and Signatories
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_specific_reservation_and_signatories/:reservation_id
exports.viewSpecificReservationAndSignatories = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Reservation_Signatory.findAll({
        where: { reservation_id: req.params.reservation_id },
        include: [
            {
                model: db.Reservation,
                as: 'assigned_reservation',
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
            if (data) {
                dataResponse(
                    res,
                    data,
                    'Reservation and Signatories has been identified',
                    'No Record has been identified'
                )
            } else {
                emptyDataResponse(res, 'No Record has been identified')
            }
        })
        .catch(err => errResponse(res, err))
}
