// ? ======================================================================
// ? INFO CONTROLLER
// ? This controller is for querying admin related information.
// ? ======================================================================

// Import required packages
const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const bcrypt = require('bcrypt')

// % Gets the information of the currently logged in user.
// % ROUTE: /mypupqc/v1/super_admin/info
exports.getInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.AdminProfile.findOne({
        where: {
            admin_id: req.user.admin_id,
        },
        include: [
            {
                model: db.Admin,
                attributes: ['admin_id', 'user_no'],
                as: 'admin_profile',
            },
        ],
    })
        .then(data =>
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        )
        .catch(err => errResponse(res, err))
}

// % Updates the information of the currently logged in user.
// % ROUTE: /mypupqc/v1/super_admin/info
exports.updateInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    db.AdminProfile.update(req.body, { where: { admin_id: req.user.admin_id } })
        .then(result => {
            if (result == 1) {
                db.Admin.findByPk(req.user.admin_id, {
                    include: ['admin_profiles'],
                }).then(resultData => {
                    dataResponse(
                        res,
                        resultData,
                        'Successfully edited your information.',
                        'Failed to update your information, something happened, please try again.'
                    )
                })
            } else errResponse(res, 'Error in updating user profile')
        })
        .catch(err => errResponse(res, err))
}

// % Updates the password of the currently logged in user.
// % ROUTE: /mypupqc/v1/super_admin/info/change_password
exports.changePassword = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    // Get password from req.body
    const new_password = bcrypt.hashSync(req.body.new_password, 10)
    console.log({
        admin_id: req.user.admin_id,
        password: req.body.new_password,
        hashed: new_password,
    })

    db.Admin.findByPk(req.user.user_id, { attributes: ['user_id', 'password'] })
        .then(result => {
            if (result) {
                db.Admin.update(
                    { password: new_password },
                    { where: { user_id: req.user.user_id } }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Password has been changed successfully',
                            'Password is not changed. Please try again'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}
