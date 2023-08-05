/* 
 ? ======================================================================
 ? DOCUMENTS CONTROLLER - SUPER ADMIN
 ? ======================================================================
 */

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')

// % -> Add Document
// % ROUTE: /mypupqc/v1/odrs/super_admin/upload_document
exports.uploadDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Document.create(req.body)
        .then(data => {
            dataResponse(res, data, 'Document has been uploaded', 'No Document has been uploaded')
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Documents
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_documents
exports.viewAllDocuments = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
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

// % -> View All Deleted Documents
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_deleted_documents
exports.viewAllDeletedDocuments = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Document.findAll({
        paranoid: false,
        where: {
            document_status: 'Deleted',
        },
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Deleted Documents have been retrieved',
                'No Deleted Documents have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Specific Document
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_document/:document_id
exports.viewSpecificDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const document_id = req.params.document_id

    db.Document.findOne({ where: { document_id: document_id }, include: ['document_requirements'] })
        .then(data => {
            dataResponse(res, data, 'Document has been retrieved', 'No Document has been retrieved')
        })
        .catch(err => errResponse(res, err))
}

// % -> Edit Document
// % ROUTE: /mypupqc/v1/odrs/super_admin/edit_document/:document_id
exports.editDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const document_id = req.params.document_id

    db.Document.update(req.body, { where: { document_id: document_id } })
        .then(result => {
            if (result == 1) {
                db.Document.findByPk(document_id)
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'Document has been updated',
                            'No Document has been updated'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else errResponse(res, 'Error in updating document')
        })
        .catch(err => errResponse(res, err))
}

// % -> Soft Delete Document
// % ROUTE: /mypupqc/v1/odrs/super_admin/delete_document/:document_id
exports.deleteDocument = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const document_id = req.params.document_id

    // Update document_status to Deleted and Destroy Document
    db.Document.update(
        { document_status: 'Deleted' },
        {
            where: { document_id: document_id },
        }
    ).then(result => {
        if (result == 1) {
            db.Document.destroy({ where: { document_id: document_id } })
                .then(data => {
                    if (data == 1)
                        dataResponse(
                            res,
                            data,
                            'Document has been deleted',
                            'No Document has been deleted'
                        )
                    else errResponse(res, 'Error in deleting document')
                })
                .catch(err => errResponse(res, err))
        } else errResponse(res, 'Error in deleting document')
    })
}
