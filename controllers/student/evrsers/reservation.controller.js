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
const { BlobServiceClient } = require('@azure/storage-blob')
var Sequelize = require('sequelize')

// % View specific Reservation.
// % ROUTE: /mypupqc/v1/evrsers/student/:facility_id
exports.viewSpecificReservation = (req, res, next) => {
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
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: ['organization_abbreviation'],
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

// % View all Reservation (not history).
// % ROUTE: /mypupqc/v1/evrsers/student/view_reservations
exports.viewAllReservations = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const lastReservationDate = await db.Reservation.max('reserve_date', {
        where: {
            user_id: req.user.user_id,
            reserve_status: {
                [Op.or]: [
                    'For Review',
                    'For Evaluation / Processing',
                    'Approved & Released',
                    'For Revision',
                ],
            },
        },
    })
    console.log(lastReservationDate)

    const user_id = req.user.user_id

    db.Reservation.findAll({
        where: {
            user_id: user_id,
            reserve_status: {
                [Op.or]: [
                    'For Review',
                    'For Evaluation / Processing',
                    'Approved & Released',
                    'For Revision',
                ],
            },
            reserve_date: {
                [Op.between]: [new Date(), lastReservationDate],
            },
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
                attributes: ['facility_name'],
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: ['organization_abbreviation'],
            },
            {
                model: db.ReservationPubmats,
                as: 'ReservationPubmats',
                attributes: ['pubmats_images'],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Signatories for the reservation
// % ROUTE: /mypupqc/v1/evrsers/student/view_signatories/:reservation_id
exports.viewAllSignatories = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
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

// % View all reservations and the facility that made by the student.
// % ROUTE: /mypupqc/v1/evrsers/student/view_history/
exports.viewStudentHistory = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Reservation.findAll({
        where: {
            user_id: req.user.user_id,
            reserve_status: {
                [Op.or]: ['Done', 'Cancelled by Student', 'Cancelled by Staff'],
            },
        },
        include: [
            {
                model: db.Facilities,
                as: 'facilities_assigned_to_reservation',
                attributes: ['facility_name'],
            },
            {
                model: db.Organization,
                as: 'organization_assigned_to_reservations',
                attributes: ['organization_abbreviation'],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Add a new Reservation.
// % ROUTE: /mypupqc/v1/evrsers/student/add_reservation
exports.addReservation = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const numberOfReservations = await db.Reservation.count({
        where: {
            user_id: req.user.user_id,
            reserve_status: 'For Review',
        },
    })

    if (numberOfReservations >= 1) {
        return errResponse(
            res,
            'Existing reservation was found! You can only have 1 reservation at a time. You may cancel your existing reservation to add a new one.'
        )
    }

    if (!req.files) {
        errResponse(res, 'No file uploaded')
    }

    const reservationInfoBody = {
        facility_id: req.body.facility_id, // remove
        user_id: req.user.user_id,
        organization_id: req.body.organization_id,
        event_title: req.body.event_title,
        event_details: req.body.event_details,
        reserve_date: req.body.reserve_date,
        pup_objectives: req.body.pup_objectives,
        pup_pillars: req.body.pup_pillars,
        time_from: req.body.time_from,
        time_to: req.body.time_to,
        reserve_status: req.body.reserve_status,
        remarks: req.body.remarks,
    }
    req.files.forEach(file => {
        if (file.fieldname == 'event_request') {
            reservationInfoBody.event_request = file.blobName
        }
        if (file.fieldname == 'concept_paper') {
            reservationInfoBody.concept_paper = file.blobName
        }
        if (file.fieldname == 'others') {
            reservationInfoBody.others = file.blobName
        }
    })

    db.Facilities.findOne({
        where: {
            facility_id: req.body.facility_id,
            facility_status: 'Available',
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'Facility is not available.')
            } else {
                db.Reservation.create(reservationInfoBody)
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'A Reservation has been added.',
                            'No Reservation has been added.'
                        )
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Edit Reservation that have a Pending status only
// % ROUTE: /mypupqc/v1/evrsers/student/edit_reservation/:reservation_id
exports.editReservation = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    console.log(req.files)

    if (!req.files) {
        // * kung walang req.files to upload meaning text lang binago niya
        const reservationInfoBody = {
            facility_id: req.body.facility_id,
            user_id: req.user.user_id,
            organization_name: req.body.organization_id,
            event_title: req.body.event_title,
            event_details: req.body.event_details,
            reserve_date: req.body.reserve_date,
            pup_objectives: req.body.pup_objectives,
            pup_pillars: req.body.pup_pillars,
            time_from: req.body.time_from,
            time_to: req.body.time_to,
            remarks: req.body.remarks,
        }
        db.Reservation.findOne({
            where: {
                reservation_id: req.params.reservation_id,
                reserve_status: {
                    [Op.or]: ['For Review', 'For Revision'],
                },
            },
        })
            .then(data => {
                if (data == null) {
                    errResponse(res, 'Reservation is not For Review.')
                } else {
                    db.Reservation.update(reservationInfoBody, {
                        where: {
                            reservation_id: req.params.reservation_id,
                        },
                    })
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'A Reservation updated.',
                                'No Reservation updated.'
                            )
                        })
                        .catch(err => errResponse(res, err))
                }
            })
            .catch(err => errResponse(res, err))
    } else {
        // * kung meron, handle it with files
        const reservationInfoBody = {
            facility_id: req.body.facility_id,
            user_id: req.user.user_id,
            organization_name: req.body.organization_id,
            event_title: req.body.event_title,
            event_details: req.body.event_details,
            reserve_date: req.body.reserve_date,
            pup_objectives: req.body.pup_objectives,
            pup_pillars: req.body.pup_pillars,
            time_from: req.body.time_from,
            time_to: req.body.time_to,
            remarks: req.body.remarks,
        }

        // >> Check if there is an existing reservation_attachments_1/2/3
        // >> Kung meron, i-return yung array ng mga data na ito sa may reservationAttachments variable
        // >> Kung wala, just return null.
        const reservationAttachments = await db.Reservation.findOne({
            where: {
                reservation_id: req.params.reservation_id,
            },
            attributes: ['event_request', 'concept_paper', 'others'],
        })
            .then(data => {
                if (data == null) {
                    errResponse(res, 'Reservation is not For Review.')
                } else {
                    if (
                        data.event_request == null &&
                        data.concept_paper == null &&
                        data.others == null
                    ) {
                        return null
                    } else {
                        return [data.event_request, data.concept_paper, data.others]
                    }
                }
            })
            .catch(err => errResponse(res, err))

        console.log(reservationAttachments)

        // >> If reservationAttachments has a value then...
        if (reservationAttachments != null) {
            // % 1. Loop through each Blob Files in that Database (reservationAttachments.forEach()) Example: ['blob1.jpg', 'blob2.jpg']
            reservationAttachments.forEach(blobName => {
                // % 2. Since link na kasi yung nireturn sa may database, get the file name by splitting the link of the array using split('\')
                // %    Tapos get the last value which is yung file name sa blob container.
                const blob = blobName.split('/')[4]
                // % 3. Connect to the container using Azure Client Core npm package.
                const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
                const container = 'reservation-attachments'
                const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                    .getContainerClient(container)
                    .getBlobClient(blob)
                // % 4. If <file_name> exists, then delete then console.log if deleted.
                blobClient.deleteIfExists().then(result => {
                    console.log(result._response.status + ' blob removed')
                })
            })
        }

        // >> Upload the attachments to the Database
        req.files.forEach(file => {
            if (file.fieldname == 'event_request') {
                reservationInfoBody.reserve_attachments_1 = file.blobName
            }
            if (file.fieldname == 'concept_paper') {
                reservationInfoBody.reserve_attachments_2 = file.blobName
            }
            if (file.fieldname == 'others') {
                reservationInfoBody.reserve_attachments_3 = file.blobName
            }
        })
        db.Reservation.findOne({
            where: {
                reservation_id: req.params.reservation_id,
                reserve_status: {
                    [Op.or]: ['For Review', 'For Revision'],
                },
            },
        })
            .then(data => {
                if (data == null) {
                    errResponse(res, 'Reservation is not For Review.')
                } else {
                    db.Reservation.update(reservationInfoBody, {
                        where: {
                            reservation_id: req.params.reservation_id,
                        },
                    })
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'A Reservation updated.',
                                'No Reservation updated.'
                            )
                        })
                        .catch(err => errResponse(res, err))
                }
            })
            .catch(err => errResponse(res, err))
    }
}

// % Edit Reservation status into cancel only if it is in For Review status only
// % ROUTE: /mypupqc/v1/evrsers/student/cancel_reservation/:reservation_id
exports.cancelReservation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const reservationInfoBody = {
        reserve_status: 'Cancelled by Student',
    }

    db.Reservation.findOne({
        where: {
            reservation_id: req.params.reservation_id,
            reserve_status: 'For Review',
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'Reservation is not For Review.')
            } else {
                db.Reservation.update(reservationInfoBody, {
                    where: {
                        reservation_id: req.params.reservation_id,
                    },
                })
                    .then(data => {
                        dataResponse(res, data, 'A Reservation updated.', 'No Reservation updated.')
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Add pubmats for specific Reservation that have a approved status only
// % ROUTE: /mypupqc/v1/evrsers/student/add_pubmats/:reservation_id
exports.addPubmats = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // >> Moved this logic up, kung walang inupload, then return this error.
    if (!req.files) {
        errResponse(res, 'No file uploaded')
    }

    // >> Check if there is an existing pubmat for the reservation
    // >> Kung meron, i-return yung array ng mga data na ito sa may pubmatImages variable
    // >> Kung wala, just return null.
    const pubmatImages = await db.ReservationPubmats.findOne({
        where: {
            reservation_id: req.params.reservation_id,
        },
    })
        .then(data => {
            if (data != null) {
                return data.pubmats_images
            } else {
                return null
            }
        })
        .catch(err => errResponse(res, err))

    // >> If pubmatImages has a value then...
    if (pubmatImages != null) {
        // % 1. Loop through each Blob Files in that Database (pubmatImages.forEach()) Example: ['blob1.jpg', 'blob2.jpg']
        pubmatImages.forEach(blobName => {
            // % 2. Since link na kasi yung nireturn sa may database, get the file name by splitting the link of the array using split('\')
            // %    Tapos get the last value which is yung file name sa blob container.
            const blob = blobName.split('/')[4]
            // % 3. Connect to the container using Azure Client Core npm package.
            const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
            const container = 'pubmats-attachments'
            const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                .getContainerClient(container)
                .getBlobClient(blob)
            // % 4. If <file_name> exists, then delete then console.log if deleted.
            blobClient.deleteIfExists().then(result => {
                console.log(result._response.status + ' blob removed')
            })
        })
    }

    // >> Upload the Pubmats to the Database
    const allBlobNames = req.files.map(file => file.blobName)
    console.log(allBlobNames)

    const pubmatsInfoBody = {
        reservation_id: req.params.reservation_id,
        pubmats_images: allBlobNames.join(';'),
    }
    console.log(pubmatsInfoBody)

    db.Reservation.findOne({
        where: {
            reservation_id: req.params.reservation_id,
            reserve_status: 'Approved & Released',
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'Reservation is not Approved & Released.')
            } else {
                if (pubmatImages != null) {
                    db.ReservationPubmats.update(pubmatsInfoBody, {
                        where: {
                            reservation_id: req.params.reservation_id,
                        },
                    })
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'A Pubmats has been updated.',
                                'No Pubmats has been updated.'
                            )
                        })
                        .catch(err => errResponse(res, err))
                } else {
                    db.ReservationPubmats.create(pubmatsInfoBody)
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'A Pubmats has been added.',
                                'No Pubmats has been added.'
                            )
                        })
                        .catch(err => errResponse(res, err))
                }
            }
        })
        .catch(err => errResponse(res, err))
}

// % View all Active Facilities
// % ROUTE: /mypupqc/v1/evrsers/student/view_all_facilities
exports.viewAllFacilitiesStudent = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Facilities.findAll({
        where: {
            facility_status: 'Available',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Facility has been found.', 'No Facility has been found.')
        })
        .catch(err => errResponse(res, err))
}

// % View all Organization (without conditions).
// % ROUTE: /mypupqc/v1/evrsers/student/view_organization
exports.viewAllOrganizationStudent = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Organization.findAll({
        where: {
            organization_status: {
                [Op.not]: ['Deleted', 'Inactive'],
            },
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View all Organization Abbreviation x Org Name (Active Only).
// % ROUTE: /mypupqc/v1/evrsers/student/view_organization_abb
exports.viewAllOrganizationAbbStudent = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Organization.findAll({
        attributes: [
            [
                Sequelize.literal(
                    `CASE WHEN char_length(organization_abbreviation) = 0 THEN organization_name ELSE organization_abbreviation END`
                ),
                'display_name',
            ],
        ],
        where: {
            organization_status: {
                [Op.not]: ['Deleted', 'Inactive'],
            },
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}
