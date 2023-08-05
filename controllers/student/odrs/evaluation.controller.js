// ? ======================================================================
// ? EVALUATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % View Evaluation
// % ROUTE: /mypupqc/v1/odrs/student/view_evaluation/:evaluation_id (GET)
exports.viewEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
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

// % Add Evaluation
// % ROUTE: /mypupqc/v1/odrs/student/add_evaluation/:request_id (POST)
exports.addEvaluation = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const request_id = req.params.request_id

    const evalData = {
        request_id: request_id,
        user_id: req.user.user_id,
        evaluation_date: new Date(),
        quality_rating: req.body.quality_rating,
        timeliness_rating: req.body.timeliness_rating,
        courtesy_rating: req.body.courtesy_rating,
        average_rating: calculateAverageRating(
            req.body.quality_rating,
            req.body.timeliness_rating,
            req.body.courtesy_rating
        ),
        evaluation_comment: req.body.evaluation_comment,
    }

    db.Document_Request_Evaluation.create(evalData)
        .then(data => {
            db.Request.update(
                {
                    is_evaluated: true,
                },
                {
                    where: {
                        request_id: request_id,
                    },
                }
            )
                .then(result => {
                    if (result == 1) {
                        return dataResponse(
                            res,
                            data,
                            'Evaluation added',
                            'Evaluation not added...'
                        )
                    } else {
                        return errResponse(res, 'Evaluation not added...')
                    }
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

function calculateAverageRating(quality_rating, timeliness_rating, courtesy_rating) {
    let average =
        [+quality_rating, +timeliness_rating, +courtesy_rating].reduce(
            (partialSum, a) => partialSum + a,
            0
        ) / 3
    average = Math.round(average * 1000) / 1000
    return average
}
