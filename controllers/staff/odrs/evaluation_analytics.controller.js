// ? ======================================================================
// ? EVALUATION ANALYTICS CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Analytics: Evaluation of Average of Ratings for the Current Year
// % ROUTE: /mypupqc/v1/odrs/pup_staff/evaluation_analytics/total_average_rating (GET)
exports.totalAverageRating = (req, res) => {
    res.send('Evaluation Analytics Total Average Rating')
}

// % Analytics: Number of Evaluated Requests for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/odrs/pup_staff/evaluation_analytics/number_of_evaluated_requests (GET)
exports.numberOfEvaluatedRequests = (req, res) => {
    res.send('Evaluation Analytics Number of Evaluated Requests')
}

// % Analytics: Average of Ratings for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/odrs/pup_staff/evaluation_analytics/average_rating_of_evaluated_requests (GET)
exports.averageRatingOfEvaluatedRequests = (req, res) => {
    res.send('Evaluation Analytics Average Rating of Evaluated Requests')
}

// % Analytics: Number of Evaluated Requests for the Current Year for each month (January - December)
// % ROUTE: /mypupqc/v1/odrs/pup_staff/evaluation_analytics/number_of_evaluations_for_this_user_for_the_current_year (GET)
exports.evaluationCountForThisUserThisYear = (req, res) => {
    res.send('Evaluation Analytics Evaluation Count for This User This Year')
}
