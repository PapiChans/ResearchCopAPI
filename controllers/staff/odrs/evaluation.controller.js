// ? ======================================================================
// ? EVALUATION CONTROLLER - PUP STAFF
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View Evaluation
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_evaluation/:evaluation_id (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const evaluation_id = req.params.evaluation_id

    db.Document_Request_Evaluation.findByPk(evaluation_id, {
        include: [
            'document_request_evaluation',
            {
                model: db.User,
                as: 'document_request_evaluation_user',
                include: ['user_profiles'],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Evaluation found', 'Evaluation not found...')
        })
        .catch(err => errResponse(res, err))
}
