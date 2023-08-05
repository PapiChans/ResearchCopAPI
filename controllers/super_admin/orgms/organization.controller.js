// ? ======================================================================
// ? ORGANIZATION CONTROLLER - SUPER ADMIN
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View Registered Organizations (organization_status = "Active")
// % ROUTE: /mypupqc/super_admin/view/registered_organization (GET)
exports.viewRegisteredOrganizations = (req, res) => {
    db.Organization.findAll({
        where: {
            organization_status: 'Active',
        },
        include: [
            {
                separate: true,
                model: db.OrganizationOfficers,
                as: 'officers_assigned_to_organization',
                include: [
                    {
                        model: db.User,
                        as: 'users_assigned_to_organizations',
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
            },
        ],
    })
        .then(result =>
            dataResponse(
                res,
                result,
                'Registered organizations has been identified successfully!',
                'No registered organizations has been identified!'
            )
        )
        .catch(err => errResponse(res, err))
}
