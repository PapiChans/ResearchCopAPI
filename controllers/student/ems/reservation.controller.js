// ? ======================================================================
// ? EVENT RESERVATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const { BlobServiceClient } = require('@azure/storage-blob')

// % Add Reservation
// % ROUTE: /mypupqc/v1/ems/student/add/reservation (POST)
exports.addReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    req.body.organization_id = await db.OrganizationOfficers.findOne({
        where: {
            user_id: req.user.user_id,
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'You are not an officer of any organization.')
            } else {
                return data.organization_id
            }
        })
        .catch(err => errResponse(res, err))

    req.body.user_id = req.user.user_id

    const numberOfReservations = await db.EventReservation.count({
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

    req.files.forEach(file => {
        if (file.fieldname == 'event_request') {
            req.body['event_request'] = file.blobName
        } else if (file.fieldname == 'concept_paper') {
            req.body['concept_paper'] = file.blobName
        } else if (file.fieldname == 'others') {
            req.body['others'] = file.blobName
        }
    })

    console.log(req.body)

    db.EventReservation.create(req.body)
        .then(data =>
            dataResponse(
                res,
                data,
                'A reservation was successfully added!',
                'Failed to add a reservation'
            )
        )
        .catch(err => errResponse(res, err))
}
// % View Event Reservation of Organization
// % ROUTE: /mypupqc/v1/ems/student/view/organization_reservation (GET)
exports.viewEventsOfOrganization = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const organization_id = await db.OrganizationOfficers.findOne({
        where: {
            user_id: req.user.user_id,
        },
    })
        .then(data => {
            if (data == null) {
                errResponse(res, 'You are not an officer of any organization.')
            } else {
                return data.organization_id
            }
        })
        .catch(err => errResponse(res, err))

    db.EventReservation.findAll({
        where: {
            organization_id: organization_id,
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
    })
        .then(data => {
            if (data.length == 0) {
                emptyDataResponse(res, 'No reservation found')
            } else {
                dataResponse(res, data, 'Reservation/s found', 'No reservation found')
            }
        })
        .catch(err => errResponse(res, err))
}

// % View User Event Reservation
// % ROUTE: /mypupqc/v1/ems/student/view/reservation (GET)
exports.viewUserEventReservation = async (req, res) => {
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

    db.EventReservation.findAll({
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
            reserve_date: {
                [Op.between]: [new Date(), lastReservationDate],
            },
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
    })
        .then(data => {
            if (data.length == 0) {
                emptyDataResponse(res, 'No reservation found')
            } else {
                dataResponse(res, data, 'Reservation/s found', 'No reservation found')
            }
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Reservation
// % ROUTE: /mypupqc/v1/ems/student/view/reservation/:reservation_id (GET)
exports.viewSpecificReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
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
        ],
    })
        .then(data => {
            if (!data) {
                emptyDataResponse(res, 'No reservation found')
            } else {
                dataResponse(res, data, 'Reservation found', 'No reservation found')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Edit Reservation
// % ROUTE: /mypupqc/v1/ems/student/edit/reservation/:reservation_id (PUT)
exports.editReservation = async (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // ? text lang binago no uploaded files
    if (!req.files) {
        db.EventReservation.update(req.body, {
            where: { reservation_id: req.params.reservation_id },
        })
            .then(data => {
                if (data[0] == 1) {
                    dataResponse(
                        res,
                        null,
                        'Reservation was updated successfully',
                        'Failed to update reservation'
                    )
                } else {
                    errResponse(res, 'Reservation was not updated')
                }
            })
            .catch(err => errResponse(res, err))
    }
    // ? may file uploaded
    else {
        // >> Check if there is an existing reservation_attachments_1/2/3
        // >> Kung meron, i-return yung array ng mga data na ito sa may reservationAttachments variable
        // >> Kung wala, just return null.
        const reservationAttachments = await db.EventReservation.findOne({
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
                req.body.event_request = file.blobName
            }
            if (file.fieldname == 'concept_paper') {
                req.body.concept_paper = file.blobName
            }
            if (file.fieldname == 'others') {
                req.body.others = file.blobName
            }
        })

        db.EventReservation.findOne({
            where: {
                reservation_id: req.params.reservation_id,
                reserve_status: {
                    [Op.or]: ['For Review', 'For Revision'],
                },
            },
        })
            .then(data => {
                if (data == null) {
                    errResponse(res, 'Reservation is not For Review or For Revision.')
                } else {
                    db.EventReservation.update(req.body, {
                        where: {
                            reservation_id: req.params.reservation_id,
                        },
                    })
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'Reservation updated.',
                                'No Reservation updated.'
                            )
                        })
                        .catch(err => errResponse(res, err))
                }
            })
            .catch(err => errResponse(res, err))
    }
}

// % Cancel Reservation
// % ROUTE: /mypupqc/v1/ems/student/cancel/reservation/:reservation_id (PUT)
exports.cancelReservation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.EventReservation.update(
        { reserve_status: 'Cancelled by Student' },
        { where: { reservation_id: req.params.reservation_id } }
    )
        .then(data => {
            if (data[0] == 1) {
                dataResponse(
                    res,
                    null,
                    'Reservation was cancelled successfully',
                    'Failed to cancel reservation'
                )
            } else {
                errResponse(res, 'Reservation was not cancelled')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Add Pubmats
// % ROUTE: /mypupqc/v1/ems/student/add/pubmats/:reservation_id (PUT)
exports.addPubmats = async (req, res) => {
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

    db.EventReservation.findOne({
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
