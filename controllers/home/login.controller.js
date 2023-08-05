/**
 * =====================================================================
 * * LOGIN CONTROLLER
 * =====================================================================
 * Controller for Login
 * =====================================================================
 */

// Import required packages
const db = require('../../models')
const { errResponse, emptyDataResponse } = require('../../helpers/controller.helper')
const jwt = require('jsonwebtoken')

// import aes256.js helper
const { decrypt } = require('../../helpers/aes256')

// env config
require('dotenv').config()

// Generate token
const generateToken = data => {
    return jwt.sign(data, process.env.SECRET_TOKEN, { expiresIn: '12h' })
}

// % Login
// % ROUTE: /mypupqc/v1/login
exports.login = (req, res) => {
    // Check if email and password field is empty
    if (String(req.body.user_no) === '' || String(req.body.password) === '') {
        return res.status(500).send({
            error: true,
            message: 'User Number and Password cannot be empty',
        })
    }

    db.User.findOne({
        where: { user_no: req.body.user_no },
    })
        .then(data => {
            if (data == null) {
                // user does not exist or not active
                errResponse(res, 'Invalid details or password')
            } else {
                if (data.login_attempt < 3) {
                    if (req.body.password !== decrypt(data.password)) {
                        data.update({ login_attempt: data.login_attempt + 1 })
                        return errResponse(
                            res,
                            `Invalid details or password. Please try again. Remaining attempts: ${
                                3 - data.login_attempt
                            }`
                        )
                    } else {
                        // Else send reponse with data
                        const user_id = data.user_id
                        const user_no = data.user_no
                        const user_type = data.user_type

                        data.update({ login_attempt: 0 }).then(() => {
                            // ... existing code to retrieve user roles and generate response
                            db.UserRole.findAll({
                                where: { user_id: data.user_id },
                                include: [
                                    {
                                        model: db.Role,
                                        attributes: ['role_id', 'role_name'],
                                        as: 'role_assigned_to_user',
                                    },
                                ],
                            })
                                .then(data => {
                                    let roles = []

                                    data.forEach(user_role => {
                                        roles.push(user_role.role_assigned_to_user.role_name)
                                    })

                                    if (roles.length === 0) roles = null

                                    res.send({
                                        error: false,
                                        data: {
                                            user_id: user_id,
                                            user_no: user_no,
                                            user_type: user_type,
                                            user_roles: roles,
                                            token: generateToken({
                                                user_id: user_id,
                                                user_no: user_no,
                                                user_type: user_type,
                                                user_roles: roles,
                                            }),
                                        },
                                        message: 'User Retrieved, Token Generated',
                                    })
                                })
                                .catch(err => errResponse(res, err))
                        })
                    }
                } else {
                    errResponse(
                        res,
                        'User has been blacklisted due to excessive login attempts. Please try again after 15 minutes'
                    )
                }
            }
        })
        .catch(err => errResponse(res, err))
}

// % Login to Admin
// % ROUTE: /mypupqc/v1/loginToAdmin
exports.loginToAdmin = (req, res) => {
    // Check if email and password field is empty
    if (String(req.body.user_no) === '' || String(req.body.password) === '') {
        return res.status(500).send({
            error: true,
            message: 'User Number and Password cannot be empty',
        })
    }

    db.Admin.findOne({
        where: { user_no: req.body.user_no },
    })
        .then(data => {
            if (data == null) {
                // user does not exist or not active
                errResponse(res, 'Invalid details or password')
            } else {
                if (data.login_attempt < 3) {
                    if (req.body.password !== decrypt(data.password)) {
                        data.update({ login_attempt: data.login_attempt + 1 })
                        return errResponse(
                            res,
                            `Invalid details or password. Please try again. Remaining attempts: ${
                                3 - data.login_attempt
                            }`
                        )
                    } else {
                        // Else send reponse with data
                        const admin_id = data.admin_id
                        const user_no = data.user_no
                        const user_type = data.user_type

                        data.update({ login_attempt: 0 }).then(() => {
                            res.send({
                                error: false,
                                data: {
                                    admin_id: admin_id,
                                    user_no: user_no,
                                    user_type: user_type,
                                    token: generateToken({
                                        admin_id: admin_id,
                                        user_no: user_no,
                                        user_type: user_type,
                                    }),
                                },
                                message: 'User Retrieved, Token Generated',
                            })
                        })
                    }
                } else {
                    errResponse(
                        res,
                        'User has been blacklisted due to excessive login attempts. Please try again after 15 minutes'
                    )
                }
            }
        })
        .catch(err => errResponse(res, err))
}
