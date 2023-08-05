// ? ======================================================================
// ? VERIFICATION CONTROLLER
// ? ======================================================================

// Import required packages
const db = require('../../models')
const { checkAuthorization, dataResponse, errResponse } = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Generate Code
// % ROUTE: /mypupqc/v1/pup_staff/verification
exports.generateCode = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Verification.create()
        .then(data =>
            dataResponse(
                res,
                data,
                'A verification code has been generated.',
                'No verification code has been generated.'
            )
        )
        .catch(err => errResponse(res, err))
}

// % Get All Unexpired Codes
// % ROUTE: /mypupqc/v1/pup_staff/verification
exports.getAllUnexpiredCodes = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Verification.findAll({
        where: {
            is_expired: false,
            expiration_date: { [Op.gte]: new Date() },
        },
    })
        .then(data =>
            dataResponse(
                res,
                data,
                'Unexpired verification codes have been retrieved.',
                'No unexpired verification codes have been retrieved.'
            )
        )
        .catch(err => errResponse(res, err))
}
