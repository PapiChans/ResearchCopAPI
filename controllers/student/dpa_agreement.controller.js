// ? ======================================================================
// ? DPA AGREEMENT CONTROLLER
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get DPA Agreement
// % ROUTE: /mypupqc/v1/student/view/dpa_agreement
exports.getDPA = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.UserDPA.findOne({
        where: {
            user_id: req.user.user_id,
        },
        attributes: ['is_signed'],
    }).then(data => {
        dataResponse(res, data, 'DPA Agreement found.', 'No DPA Agreement found.')
    })
}

// % Sign DPA Agreement
// % ROUTE: /mypupqc/v1/student/submit/dpa_agreement
exports.signDPA = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.UserDPA.create(
        {
            user_id: req.user.user_id,
        },
        {
            attributes: ['is_signed'],
        }
    )
        .then(data => {
            dataResponse(res, data, 'DPA Agreement signed.', 'Cannot sign DPA Agreement.')
        })
        .catch(err => errResponse(res, err))
}
