// ? ======================================================================
// ? INFO CONTROLLER
// ? This controller is for querying Student related information.
// ? ======================================================================

// Import required packages
const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { encrypt } = require('../../helpers/aes256')

// % Gets the information of the currently logged in user.
// % ROUTE: /mypupqc/v1/super_admin/info
exports.getInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
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
// % ROUTE: /mypupqc/v1/super_admin/info
exports.updateInfo = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
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
// % ROUTE: /mypupqc/v1/super_admin/info/change_password
exports.changePassword = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Get password from req.body
    const new_password = encrypt(req.body.new_password)
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

// % -> Gets the education profile of the currently logged in user.
exports.getEducProfile = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.EducationProfile.findOne({ where: { user_id: user_id } })
        .then(data => {
            dataResponse(
                res,
                data,
                'Education Profile has been retrieved',
                'No Education Profile has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> Updates the education profile of the currently logged in user.
exports.updateEducProfile = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.EducationProfile.update(req.body, { where: { user_id: user_id } })
        .then(data => {
            if (data == 1) {
                db.EducationProfile.findOne({ where: { user_id: user_id } }).then(result => {
                    dataResponse(
                        res,
                        result,
                        'Education Profile has been updated',
                        'No Education Profile has been updated'
                    )
                })
            } else {
                errResponse(res, 'Error in updating education profile')
            }
        })
        .catch(err => errResponse(res, err))
}
