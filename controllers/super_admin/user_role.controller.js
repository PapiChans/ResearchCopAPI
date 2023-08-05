// ? ======================================================================
// ? User Role <-> Role CONTROLLER
// ? This controller is for queries related to User Role <-> Role Relationship.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Gets all the users and their roles.
// % ROUTE: /mypupqc/v1/super_admin/user_role/all
exports.viewAllUsersRoles = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findAll({
        where: {
            [Op.or]: [{ user_type: req.params.user_type }],
        },
        include: [
            {
                model: db.UserProfile,
                attributes: ['full_name'],
                as: 'user_profiles',
            },
        ],
    })
        .then(userData => {
            if (userData.length === 0) {
                return emptyDataResponse(res, 'No users found.')
            }

            db.UserRole.findAll({
                include: [
                    {
                        model: db.Role,
                        attributes: ['role_id', 'role_name'],
                        as: 'role_assigned_to_user',
                    },
                ],
            })
                .then(userRoleData => {
                    if (userRoleData.length === 0) {
                        return emptyDataResponse(res, 'No user roles found.')
                    }

                    // Use a map to store the user roles by user ID
                    const userRolesMap = new Map()
                    userRoleData.forEach(userRole => {
                        const userId = userRole.user_id
                        if (!userRolesMap.has(userId)) {
                            userRolesMap.set(userId, [])
                        }
                        userRolesMap.get(userId).push(userRole.role_assigned_to_user)
                    })

                    // filter any null values
                    userRolesMap.forEach((value, key) => {
                        userRolesMap.set(key, value.filter(role => role !== null))
                    })

                    // Create the final array of users and their roles
                    const usersRoles = []
                    userData.forEach(user => {
                        const userRoles = userRolesMap.get(user.user_id) || []
                        if (userRoles.length > 0) {
                            usersRoles.push({
                                user_id: user.user_id,
                                user_no: user.user_no,
                                user_type: user.user_type,
                                user_profiles: user.user_profiles,
                                user_roles: userRoles,
                            })
                        }
                    })

                    dataResponse(
                        res,
                        usersRoles,
                        'All users and their roles found.',
                        'No users and their roles found.'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Gets a user and their roles.
// % ROUTE: /mypupqc/v1/super_admin/user_role/:user_id
exports.viewSpecificUsersRoles = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findOne({
        where: { user_id: req.params.user_id },
        include: [
            {
                model: db.UserProfile,
                attributes: ['full_name'],
                as: 'user_profiles',
            },
        ],
    })
        .then(userData => {
            if (userData === null) {
                return emptyDataResponse(res, 'No user found.')
            }

            db.UserRole.findAll({
                where: { user_id: req.params.user_id },
                include: [
                    {
                        model: db.Role,
                        attributes: ['role_id', 'role_name'],
                        as: 'role_assigned_to_user',
                    },
                ],
            })
                .then(userRoleData => {
                    if (userRoleData.length === 0) {
                        return emptyDataResponse(res, 'No user roles found.')
                    }

                    // Create the final array of users and their roles
                    const usersRoles = []
                    usersRoles.push({
                        user_id: userData.user_id,
                        user_no: userData.user_no,
                        user_type: userData.user_type,
                        user_profiles: userData.user_profiles,
                        user_roles: userRoleData.map(
                            userRole => userRole.role_assigned_to_user.role_name
                        ),
                    })

                    dataResponse(
                        res,
                        usersRoles,
                        'A user and their roles found.',
                        'No user and their roles found.'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Get all roles active and then return the roles that are available to add.
// % ROUTE: /mypupqc/v1/super_admin/all_roles/:user_id
exports.getAllRoles = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findOne({ where: { user_id: req.params.user_id } })
        .then(async userData => {
            if (userData === null) {
                return emptyDataResponse(res, 'No user found.')
            }

            // use an await function to fetch all the active roles from the database and store it all in an array
            const roles = await db.Role.findAll({
                where: {
                    role_status: 'Active',
                    role_for: {
                        [Op.or]: [userData.user_type, 'Both'],
                    },
                },
            })
                .then(result => {
                    return result.map(role => {
                        return role.role_name
                    })
                })
                .catch(err => errResponse(res, err))
            console.log(roles)

            db.UserRole.findAll({
                where: { user_id: req.params.user_id },
                include: [
                    {
                        model: db.Role,
                        attributes: ['role_name'],
                        as: 'role_assigned_to_user',
                    },
                ],
            })
                .then(userRoleData => {
                    if (userRoleData.length === 0) {
                        return dataResponse(
                            res,
                            roles,
                            'All available roles found.',
                            'No available roles to show.'
                        )
                    }

                    // Create an array of all the current roles assigned to the user
                    const current_roles = userRoleData.map(
                        userRole => userRole.role_assigned_to_user.role_name
                    )

                    const roles_to_show = roles.filter(role => current_roles.indexOf(role) === -1)

                    dataResponse(
                        res,
                        roles_to_show,
                        'All available roles found.',
                        'No available roles to show.'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Get All the users without any roles.
// % ROUTE: /mypupqc/v1/super_admin/users_without_roles
exports.viewUsersWithoutRoles = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.UserRole.findAll()
        .then(data => {
            let userWithRoles = []
            data.forEach(element => {
                if (!userWithRoles.includes(element.user_id)) {
                    userWithRoles.push(element.user_id)
                }
            })
            db.User.findAll({
                where: {
                    user_id: { [Op.notIn]: userWithRoles },
                    user_type: req.params.user_type,
                },
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                    },
                ],
            })
                .then(data => {
                    dataResponse(
                        res,
                        data,
                        'A Record has been identified',
                        'No Record has been identified'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Assigns one or more role to a user.
// % ROUTE: /mypupqc/v1/super_admin/user_role/:user_id
exports.assignRoleToUser = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    // req.body data example: Doctor;OIC, Student Records;Dentist
    // Bale sa Frontend, need nila na i-join yung data using semicolon (;) tapos
    // ifefetch nila yung mga role_names. (use the all_roles endpoint above)
    // Update: nakalimutan ko i-take into account pano pag walang semi-colon lmao sorry
    let role_names
    if (req.body.roles.includes(';')) {
        role_names = req.body.roles.split(';')
    } else {
        role_names = [req.body.roles]
    }
    const user_id = req.params.user_id

    const role_id = await Promise.all(
        role_names.map(async role_name => {
            const role = await db.Role.findOne({ where: { role_name: role_name } })
            if (role !== null) {
                return role.role_id
            }
        })
    )

    // add multiple roles to a user
    db.UserRole.bulkCreate(
        role_id.map(role_id => {
            return { user_id: user_id, role_id: role_id }
        })
    )
        .then(data => {
            if (data.length === role_id.length) {
                dataResponse(res, data, 'Roles assigned to user.', 'No roles assigned to user.')
            } else errResponse(res, 'Error in assigning roles to user.')
        })
        .catch(err => errResponse(res, err))
}

// % Removes one or more role from a user.
// % ROUTE: /mypupqc/v1/super_admin/user_role/:user_id
exports.removeRoleFromUser = async (req, res, next) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    // req.body data example: Doctor;OIC, Student Records;Dentist
    // same logic ko sa may assignRoleToUse ang ginagawa niya is ibibigay mo yung role_names na idedelete mo
    // sa user. (use the viewSpecificUsersRoles endpoint above)
    // Update: nakalimutan ko i-take into account pano pag walang semi-colon lmao sorry (meaning isa lang ireremove)
    let role_names
    if (req.body.roles.includes(';')) {
        role_names = req.body.roles.split(';')
    } else {
        role_names = [req.body.roles]
    }
    const user_id = req.params.user_id

    const role_id = await Promise.all(
        role_names.map(async role_name => {
            const role = await db.Role.findOne({ where: { role_name: role_name } })
            if (role !== null) {
                return role.role_id
            }
        })
    )

    //remove multiple roles from a user
    db.UserRole.destroy({
        where: {
            user_id: user_id,
            role_id: role_id,
        },
    })
        .then(data => {
            if (data > 0) {
                dataResponse(res, data, 'Roles removed from user.', 'No roles removed from user.')
            } else errResponse(res, 'Error in removing roles from user.')
        })
        .catch(err => errResponse(res, err))
}
