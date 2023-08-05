/* 
 ? ======================================================================
 ? DOCUMENTS CONTROLLER - STUDENT
 ? ======================================================================
 */

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % -> View All Documents
// % ROUTE: /mypupqc/v1/odrs/student/view_documents
exports.viewAllDocuments = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Document.findAll()
        .then(data => {
            dataResponse(
                res,
                data,
                'Documents have been retrieved',
                'No Documents have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Documents Types
// % ROUTE: /mypupqc/v1/odrs/student/view_documents/:type
exports.viewAllDocumentsTypes = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const type = req.params.type

    db.Document.findAll({ where: { document_type: type } })
        .then(data => {
            dataResponse(
                res,
                data,
                'Documents have been retrieved',
                'No Documents have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Specific Document
// % ROUTE: /mypupqc/v1/odrs/student/view_documents/:document_id
exports.viewSpecificDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const document_id = req.params.document_id

    db.Document.findOne({
        where: { document_id: document_id },
        include: ['document_requirements'],
    })
        .then(data => {
            dataResponse(res, data, 'Document has been retrieved', 'No Document has been retrieved')
        })
        .catch(err => errResponse(res, err))
}
