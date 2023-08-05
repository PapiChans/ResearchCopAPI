// ? ======================================================================
// ? ROLE CONTROLLER
// ? This controller is for queries related to the roles of users.
// ? (example: PUP Staff [Dentist, Doctor, etc...] or Student [Organizer])
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Gets all the roles of the users.
// % ROUTE: /mypupqc/v1/super_admin/role
exports.viewAllRoles = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.findAll({
        where: {
            role_status: {
                [Op.not]: ['Deleted'],
            },
        },
    }).then(data => {
        if (data.length == 0) {
            return emptyDataResponse(res, 'No roles found.')
        }
        return dataResponse(res, data, 'All roles found.', 'No Roles found.')
    })
}

// % Gets a specific role.
// % ROUTE: /mypupqc/v1/super_admin/role/:role_id
exports.viewSpecificRole = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.findOne({ where: { role_id: req.params.role_id } })
        .then(data => {
            if (data !== null) dataResponse(res, data, 'A Role found.', 'No Role found.')
            else errResponse(res, 'No Role found with this ID.')
        })
        .catch(err => errResponse(res, err))
}

// % Get All Roles based on the User Type of the User
// % ROUTE: /mypupqc/v1/super_admin/user_type/:role_for
exports.viewRolesBasedOnRoleFor = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.findAll({
        where: {
            role_for: [req.params.role_for, 'Both'],
            role_status: {
                [Op.not]: ['Inactive', 'Deleted'],
            },
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Adds a role.
// % ROUTE: /mypupqc/v1/super_admin/role/add
exports.addRole = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.create(req.body)
        .then(data => {
            dataResponse(res, data, 'A Role added.', 'No Role added.')
        })
        .catch(err => errResponse(res, err))
}

// % Change Status of a Role to Active/Inactive. Acts like a Switch, if Active then switch to Inactive then vice versa.
// % ROUTE: /mypupqc/v1/super_admin/role/status/:role_id
exports.changeRoleStatus = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.findOne({ where: { role_id: req.params.role_id } })
        .then(data => {
            // Check if role_status is Active
            if (data.role_status == 'Active') {
                db.Role.update(
                    { role_status: 'Inactive' },
                    { where: { role_id: req.params.role_id } }
                )
                    .then(data => {
                        if (data == 1) {
                            db.Role.findByPk(req.params.role_id).then(result => {
                                dataResponse(
                                    res,
                                    result,
                                    'A Role deactivated.',
                                    'No Role deactivated.'
                                )
                            })
                        } else errResponse(res, 'Error in deactivating Role.')
                    })
                    .catch(err => errResponse(res, err))
            } else {
                db.Role.update(
                    { role_status: 'Active' },
                    { where: { role_id: req.params.role_id } }
                )
                    .then(data => {
                        if (data == 1) {
                            db.Role.findByPk(req.params.role_id).then(result => {
                                dataResponse(res, result, 'A Role activated.', 'No Role activated.')
                            })
                        } else errResponse(res, 'Error in activating Role.')
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % delete a role.
// % ROUTE: /mypupqc/v1/super_admin/role/delete/:role_id
exports.deleteRole = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    // ! Delete the Roles from the UserRole Table first before setting to Deleted status.
    const roles_deleted = await db.UserRole.destroy({ where: { role_id: req.params.role_id } })
        .then(data => {
            return data
        })
        .catch(err => errResponse(res, err))

    db.Role.findOne({ where: { role_id: req.params.role_id } })
        .then(data => {
            db.Role.update({ role_status: 'Deleted' }, { where: { role_id: req.params.role_id } })
                .then(data => {
                    if (data == 1) {
                        db.Role.findByPk(req.params.role_id).then(result => {
                            dataResponse(
                                res,
                                result,
                                `${roles_deleted} Users with this Role were removed and set status to Deleted.`,
                                'No Role deleted.'
                            )
                        })
                    } else errResponse(res, 'Error in deleted Role.')
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}
