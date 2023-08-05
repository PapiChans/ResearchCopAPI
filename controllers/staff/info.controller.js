// ? ======================================================================
// ? INFO CONTROLLER
// ? This controller is for querying PUP Staff related information.
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
// % ROUTE: /mypupqc/v1/pup_staff/info
exports.getInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.UserProfile.findOne({
        where: {
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no'],
                as: 'user_profile',
            },
        ],
    })
        .then(data =>
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        )
        .catch(err => errResponse(res, err))
}

// % Updates the information of the currently logged in user.
// % ROUTE: /mypupqc/v1/pup_staff/info
exports.updateInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    db.UserProfile.update(req.body, { where: { user_id: req.user.user_id } })
        .then(result => {
            if (result == 1) {
                db.User.findByPk(req.user.user_id, {
                    include: ['user_profiles'],
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
// % ROUTE: /mypupqc/v1/pup_staff/info/change_password
exports.changePassword = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    // Get password from req.body
    const new_password = bcrypt.hashSync(req.body.new_password, 10)
    console.log({
        user_id: req.user.user_id,
        password: req.body.new_password,
        hashed: new_password,
    })

    db.User.findByPk(req.user.user_id, { attributes: ['user_id', 'password'] })
        .then(result => {
            if (result) {
                db.User.update({ password: new_password }, { where: { user_id: req.user.user_id } })
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
