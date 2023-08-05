// ? ======================================================================
// ? HOLIDAY CONTROLLER
// ? This controller is for queries related to holidays.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Get all holidays for this month.
// % ROUTE: /mypupqc/v1/student/holiday
exports.getHolidaysForThisMonth = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Holiday.findAll({
        where: {
            holiday_status: {
                [Op.not]: ['Deleted'],
            },
            holiday_date: {
                [Op.between]: [
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                ],
            },
        },
        attributes: ['holiday_name', 'holiday_date'],
    }).then(data => {
        dataResponse(res, data, 'All holidays found.', 'No holidays found.')
    })
}
