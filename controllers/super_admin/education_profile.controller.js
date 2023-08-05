// ? ======================================================================
// ? EDUCATION PROFILE CONTROLLER
// ? This controller is for managing education profile of students.
// ? ======================================================================

// Import required packages
const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')

// % Gets the education profile of a user
// % ROUTE: /mypupqc/v1/super_admin/education_profile/:user_id
exports.viewEducationProfile = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const user_id = req.params.user_id

    db.EducationProfile.findOne({ where: { user_id: user_id } })
        .then(result => {
            if (result !== null) {
                dataResponse(
                    res,
                    result,
                    'Education Profile has been retrieved',
                    'No Education Profile has been retrieved'
                )
            } else {
                emptyDataResponse(res, 'No Education Profile has been retrieved')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Creates an education profile for a user
// % ROUTE: /mypupqc/v1/super_admin/education_profile/:user_id
exports.createEducationProfile = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const user_id = req.params.user_id

    // check if user already has an education profile
    db.EducationProfile.findOne({ where: { user_id: user_id } })
        .then(result => {
            if (result !== null) {
                errResponse(res, 'User already has an education profile')
            } else {
                db.EducationProfile.create({ ...req.body, user_id: user_id })
                    .then(result => {
                        dataResponse(
                            res,
                            result,
                            'Education Profile has been created',
                            'Error in creating education profile'
                        )
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// % Updates an education profile of a user
// % ROUTE: /mypupqc/v1/super_admin/education_profile/:user_id
exports.updateEducationProfile = (req, res) => {
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const user_id = req.params.user_id

    db.EducationProfile.update(
        {
            ...req.body,
            user_id: user_id,
        },
        { where: { user_id: user_id } }
    )
        .then(data => {
            if (data == 1) {
                db.EducationProfile.findOne({ where: { user_id: user_id } })
                    .then(result => {
                        dataResponse(
                            res,
                            result,
                            'Education Profile has been updated',
                            'No Education Profile has been updated'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else {
                errResponse(res, 'Error in updating education profile')
            }
        })
        .catch(err => errResponse(res, err))
}
