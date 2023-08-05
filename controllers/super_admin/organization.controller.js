const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

require('dotenv').config()

// % Add Organization
// % Route: /mypupqc/v1/evrsers/super_admin/add_organization
exports.addOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const organizationInfoBody = {
        organization_name: req.body.organization_name,
        organization_description: req.body.organization_description,
        organization_status: req.body.organization_status,
        organization_abbreviation: req.body.organization_abbreviation,
    }
    db.Organization.create(organizationInfoBody)
        .then(data => {
            dataResponse(res, data, 'An Organization added.', 'No Organization added.')
        })
        .catch(err => errResponse(res, err))
}

// % View all Organization (without conditions).
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_organization
exports.viewAllOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Organization.findAll({
        where: {
            organization_status: {
                [Op.not]: 'Deleted',
            },
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Organization by ID.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/view_organization/:organization_id
exports.viewSpecificOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Organization.findOne({
        where: {
            organization_id: req.params.organization_id,
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Edit a Organization based on the [:organization_id] parameter.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/edit_organization/:organization_id
exports.editOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const organizationInfoBody = {
        organization_name: req.body.organization_name,
        organization_description: req.body.organization_description,
        organization_status: req.body.organization_status,
        organization_abbreviation: req.body.organization_abbreviation,
    }
    db.Organization.update(organizationInfoBody, {
        where: {
            organization_id: req.params.organization_id,
        },
    })
        .then(data => {
            dataResponse(res, data, 'An Organization updated.', 'No Organization updated.')
        })
        .catch(err => errResponse(res, err))
}

// % Deactivate a Organization based on the [:organization_id] parameter.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/deactivate_organization/:organization_id
exports.deactivateOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Organization.findOne({
        where: {
            organization_id: req.params.organization_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.organization_status === 'Active') {
                db.Organization.update(
                    {
                        organization_status: 'Inactive',
                    },
                    {
                        where: {
                            organization_id: req.params.organization_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Organization successfully deactivated.',
                            'No such Organization has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
            // Check if user is Inactive or is_blacklist=true
            else {
                db.Organization.update(
                    {
                        organization_status: 'Active',
                    },
                    {
                        where: {
                            organization_id: req.params.organization_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Organization successfully deactivated.',
                            'No such Organization has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Soft Delete an Organization based on the [:organization_id] parameter.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/delete_organization/:organization_id
exports.deleteOrganization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Organization.update(
        {
            organization_status: 'Deleted',
        },
        {
            where: {
                organization_id: req.params.organization_id,
            },
        }
    )
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}
