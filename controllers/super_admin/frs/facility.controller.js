// ? ======================================================================
// ? FACILITY CONTROLLER
// ? This controller is for querying Super Admin related information.
// ? ======================================================================

// Import required packages
const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
} = require('../../../helpers/controller.helper')

// % View all Facility (without conditions).
// % ROUTE: /mypupqc/v1/frs/super_admin/view_facility
exports.viewAllFacility = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Facilities.findAll()
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View a specific Facility based on the [:facility_id] parameter.
// % ROUTE: /mypupqc/v1/frs/super_admin/view_specific_facility/:facility_id
exports.viewSpecificFacilityAdmin = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Facilities.findOne({
        where: {
            facility_id: req.params.facility_id,
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Add a new Facility.
// % ROUTE: /mypupqc/v1/frs/super_admin/add_facility
exports.addFacility = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    if (!req.files) {
        errResponse(res, 'No file uploaded')
    }

    const facilityInfoBody = {
        facility_name: req.body.facility_name,
        facility_picture: req.body.facility_picture,
        facility_description: req.body.facility_description,
        facility_capacity: req.body.facility_capacity,
    }

    req.files.forEach(file => {
        console.log(file)

        if (file.fieldname == 'facility_picture') {
            facilityInfoBody.facility_picture = file.blobName
        }
    })
    console.log(facilityInfoBody)

    db.Facilities.create(facilityInfoBody)
        .then(data => {
            dataResponse(res, data, 'A Facility added.', 'No Facility added.')
        })
        .catch(err => errResponse(res, err))
}

// % Edit a Facility based on the [:facility_id] parameter.
// % ROUTE: /mypupqc/v1/frs/super_admin/edit_facility/:facility_id
exports.editFacilityAdmin = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const facilityInfoBody = {
        facility_name: req.body.facility_name,
        facility_status: req.body.facility_status,
        facility_picture: req.body.facility_picture,
        facility_description: req.body.facility_description,
        facility_capacity: req.body.facility_capacity,
    }
    db.Facilities.update(facilityInfoBody, { where: { facility_id: req.params.facility_id } })
        .then(result => {
            if (result == 1) {
                db.Facilities.findByPk(req.params.facility_id).then(resultData => {
                    dataResponse(
                        res,
                        resultData,
                        'Facility successfully updated.',
                        'No such Facility has been identified.'
                    )
                })
            } else errResponse(res, 'Error in updating Facility')
        })
        .catch(err => errResponse(res, err))
}

// % Deactivate a specific Facility based on the [:facility_id] parameter.
// % ROUTE: /mypupqc/v1/frs/super_admin/deactivate/:facility_id
exports.deactivateFacility = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Facilities.findOne({
        where: {
            facility_id: req.params.facility_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.facility_status === 'Available') {
                db.Facilities.update(
                    {
                        facility_status: 'Unavailable',
                    },
                    {
                        where: {
                            facility_id: req.params.facility_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Facility successfully deactivated.',
                            'No such Facility has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
            // Check if user is Inactive or is_blacklist=true
            else {
                db.Facilities.update(
                    {
                        facility_status: 'Available',
                    },
                    {
                        where: {
                            facility_id: req.params.facility_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Facility successfully deactivated.',
                            'No such Facility has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Soft Delete a Facility
// % ROUTE: /mypupqc/v1/frs/super_admin/delete/:facility_id
exports.deleteFacility = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Facilities.update(
        {
            facility_status: 'Deleted',
        },
        {
            where: {
                facility_id: req.params.facility_id,
            },
        }
    )
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}
