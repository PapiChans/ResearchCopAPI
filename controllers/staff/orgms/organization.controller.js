// ? ======================================================================
// ? ORGANIZATION CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View Specific Organization
// % ROUTE: /mypupqc/v1/orgms/pup_staff/view/organization/:organization_id (GET)
exports.viewSpecificOrganization = (req, res) => {
    db.Organization.findOne({
        where: {
            organization_id: req.params.organization_id,
        },
        include: [
            {
                separate: true,
                model: db.OrganizationOfficers,
                as: 'officers_assigned_to_organization',
                attributes: ['user_id', 'position'],
                include: [
                    {
                        model: db.User,
                        as: 'users_assigned_to_organizations',
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
            },
        ],
    })
        .then(result =>
            dataResponse(
                res,
                result,
                'An organization has been identified successfully!',
                'No organization has been identified!'
            )
        )
        .catch(err => errResponse(res, err))
}

// % View Organization based on organization_status
// % ROUTE: /mypupqc/v1/orgms/pup_staff/view/all_organization/:organization_status (GET)
exports.viewOrganization = (req, res) => {
    db.Organization.findAll({
        where: {
            organization_status: req.params.organization_status,
        },
        include: [
            {
                separate: true,
                model: db.OrganizationOfficers,
                as: 'officers_assigned_to_organization',
                attributes: ['user_id', 'position'],
                include: [
                    {
                        model: db.User,
                        as: 'users_assigned_to_organizations',
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
            },
        ],
    })
        .then(result =>
            dataResponse(
                res,
                result,
                'Organizations have been identified successfully!',
                'No organizations have been identified!'
            )
        )
        .catch(err => errResponse(res, err))
}

// % Change Organization Status
// % ROUTE: /mypupqc/v1/orgms/pup_staff/status/organization/:organization_id (PUT)
exports.changeStatusOrganization = (req, res) => {
    const { organization_status } = req.body
    db.Organization.update(
        {
            organization_status: organization_status,
        },
        {
            where: {
                organization_id: req.params.organization_id,
            },
        }
    )
        .then(result =>
            dataResponse(
                res,
                result,
                'Organization status has been changed successfully!',
                'No organization has been changed!'
            )
        )
        .catch(err => errResponse(res, err))
}

// % Delete Organization (soft delete -> change status to Deleted)
// % ROUTE: /mypupqc/v1/orgms/pup_staff/delete/organization/:organization_id (DELETE)
exports.deleteOrganization = (req, res) => {
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
        .then(result =>
            dataResponse(
                res,
                result,
                'Organization has been deleted successfully!',
                'No organization has been deleted!'
            )
        )
        .catch(err => errResponse(res, err))
}
