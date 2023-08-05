const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.displayAllResearch = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
            
        })
        .catch(err => errResponse(res, err))
}

exports.editCoAuthors = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const mySubmissionsBody = {
        research_co_author: req.body.research_co_author,
    }

    db.ResearchDetails.update(mySubmissionsBody,{ where: {research_id: req.params.research_id}})
        .then(data => {
            dataResponse(res, data, 'Edit Co-Authors.', 'Fail Edit Co-Authors')
        })
        .catch(err => errResponse(res, err))
}