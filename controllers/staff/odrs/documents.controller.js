/* 
 ? ======================================================================
 ? DOCUMENTS CONTROLLER - PUP STAFF
 ? ======================================================================
 */

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % -> Add Document
// % ROUTE: /mypupqc/v1/odrs/pup_staff/upload_document
exports.uploadDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const documentRequirementsData = []
    const documentSignatoriesData = []

    db.Document.create(req.body)
        .then(data => {
            req.body.document_requirements !== undefined
                ? req.body.document_requirements.forEach(e => {
                      e.document_id = data.document_id
                      documentRequirementsData.push(e)
                  })
                : ''

            req.body.document_signatories !== undefined
                ? req.body.document_signatories.forEach(e => {
                      e.document_id = data.document_id
                      documentSignatoriesData.push(e)
                  })
                : ''

            if (req.body.document_signatories) {
                db.Document_Signatory.bulkCreate(documentSignatoriesData)
                    .then(() => {
                        db.Document_Requirement.bulkCreate(documentRequirementsData)
                            .then(result => {
                                dataResponse(
                                    res,
                                    result,
                                    'Document has been uploaded',
                                    'No Document has been uploaded'
                                )
                            })
                            .catch(err => errResponse(res, err))
                    })
                    .catch(err => errResponse(res, err))
            } else {
                errResponse(res, 'Error in uploading document')
            }
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Documents
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_documents
exports.viewAllDocuments = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
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

// % -> View Specific Document
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_document/:document_id
exports.viewSpecificDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const document_id = req.params.document_id

    db.Document.findOne({
        where: { document_id: document_id },
        include: [
            'document_requirements',
            {
                separate: true,
                model: db.Document_Signatory,
                as: 'document_signatories',
                include: [
                    {
                        model: db.User,
                        as: 'signatory_for_user',
                        include: ['user_profiles'],
                    },
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Document has been retrieved', 'No Document has been retrieved')
        })
        .catch(err => errResponse(res, err))
}

// % -> Edit Document
// % ROUTE: /mypupqc/v1/odrs/pup_staff/edit_document/:document_id
exports.editDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const document_id = req.params.document_id

    const documentRequirementsData = []
    const documentSignatoriesData = []

    db.Document.update(req.body, { where: { document_id: document_id } })
        .then(result => {
            if (result == 1) {
                db.Document.findByPk(document_id).then(data => {
                    if (req.body.document_requirements === undefined) {
                        db.Document_Requirement.destroy({
                            where: { document_id: document_id },
                        }).then(data => {
                            dataResponse(
                                res,
                                data,
                                'Document has been updated',
                                'No Document has been updated'
                            )
                        })
                    } else {
                        if (req.body.document_requirements) {
                            req.body.document_requirements.forEach(e => {
                                e.document_id = data.document_id
                                documentRequirementsData.push(e)
                            })
                        }
                        req.body.document_signatories.forEach(e => {
                            e.document_id = data.document_id
                            documentSignatoriesData.push(e)
                        })
                        db.Document_Signatory.destroy({
                            where: { document_id: document_id },
                        })
                            .then(() => {
                                db.Document_Requirement.destroy({
                                    where: { document_id: document_id },
                                })
                                    .then(() => {
                                        db.Document_Signatory.bulkCreate(documentSignatoriesData)
                                            .then(() => {
                                                db.Document_Requirement.bulkCreate(
                                                    documentRequirementsData
                                                )
                                                    .then(finalData => {
                                                        dataResponse(
                                                            res,
                                                            finalData,
                                                            'Document has been updated',
                                                            'No Document has been updated'
                                                        )
                                                    })
                                                    .catch(err => errResponse(res, err))
                                            })
                                            .catch(err => errResponse(res, err))
                                    })
                                    .catch(err => errResponse(res, err))
                            })
                            .catch(err => errResponse(res, err))
                    }
                })
            } else errResponse(res, 'Error in updating document')
        })
        .catch(err => errResponse(res, err))
}
