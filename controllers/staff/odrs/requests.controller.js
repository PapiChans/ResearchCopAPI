/* 
 ? ======================================================================
 ? REQUESTS CONTROLLER - PUP STAFF
 ? ======================================================================
 */

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { sendRequestUpdateEmail } = require('../../../helpers/emailSending')

// % -> View All Requests that is Pending for Clearance, For Clearance, For Evaluation/Processing, Ready for Pickup
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_requests
exports.viewAllRequests = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findAll({
        where: {
            status_of_request: [
                'Pending for Clearance',
                'For Clearance',
                'For Evaluation/Processing',
                'Ready for Pickup',
            ],
        },
        include: [
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Requests have been retrieved',
                'No Requests have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Requests based whether it is Pending or Approved
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_requests/:type_of_status
exports.viewAllRequestsStatus = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const statuses = []
    if (req.params.type_of_status === 'Pending') statuses.push('Pending for Clearance')
    else if (req.params.type_of_status === 'Approved')
        statuses.push('For Clearance', 'For Evaluation/Processing', 'Ready for Pickup')
    else return errResponse(res, 'Invalid Type of Status')

    db.Request.findAll({
        where: {
            status_of_request: statuses,
        },
        include: [
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Requests have been retrieved',
                'No Requests have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Specific Request
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_request/:request_id
exports.viewSpecificRequest = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const request_id = req.params.request_id

    db.Request.findByPk(request_id, {
        include: [
            {
                separate: true,
                model: db.Document_Request,
                as: 'documents_assigned_to_request',
                include: [
                    {
                        model: db.Document,
                        paranoid: false,
                        as: 'document_information',
                        include: ['document_requirements'],
                    },
                ],
            },
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Request has been retrieved', 'No Request has been retrieved')
        })
        .catch(err => errResponse(res, err))
}

// % -> Update Request Status
// % ROUTE: /mypupqc/v1/odrs/pup_staff/update_request_status/:status/:request_id
exports.updateRequestStatus = (req, res, next) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const request_id = req.params.request_id
    const status = req.params.status

    const data = {
        status_of_request: status,
        remarks: req.body.remarks,
        or_no: req.body.or_no,
        release_classification: req.body.release_classification,
    }

    const dateNow = new Date()
    if (status == 'For Clearance') {
        data.for_clearance = Date.now()
        data.expiration = dateNow.setDate(dateNow.getDate() + 90)
    } else if (status == 'For Evaluation') {
        data.status_of_request = 'For Evaluation/Processing'
        data.for_evaluation = Date.now()
        data.payment_status = 'Paid'
        data.expiration = null
    } else if (status == 'Ready for Pickup') {
        data.ready_for_pickup = Date.now()
        data.expiration = dateNow.setDate(dateNow.getDate() + 90)
    } else if (status == 'Released') {
        data.released = Date.now()
        data.expiration = null
    } else if (status == 'Cancelled by Staff') {
        data.payment_status = 'Cancelled'
        data.cancelled = Date.now()
    } else return errResponse(res, 'Invalid Request Status')

    db.Request.update(data, { where: { request_id: request_id } })
        .then(result => {
            if (result == 1) {
                db.Request.findByPk(request_id, {
                    include: [
                        {
                            separate: true,
                            model: db.Document_Request,
                            as: 'documents_assigned_to_request',
                            include: [
                                {
                                    model: db.Document,
                                    paranoid: false,
                                    as: 'document_information',
                                    include: ['document_requirements', 'document_signatories'],
                                },
                            ],
                        },
                        {
                            model: db.User,
                            as: 'user_assigned_to_request',
                            include: ['user_profiles', 'education_profile'],
                        },
                    ],
                })
                    .then(data => {
                        if (status === 'For Evaluation') createRequestSignatories(data)
                        sendRequestUpdateEmail(res, data)
                    })
                    .catch(err => errResponse(res, err))
            } else emptyDataResponse(res, 'Error in updating Request Status')
        })
        .catch(err => errResponse(res, err))
}

// % -> View Requests History (Released, Cancelled by Student, Cancelled by Staff)
// % ROUTE: /mypupqc/v1/odrs/pup_staff/requests_history
exports.viewRequestsHistory = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findAll({
        where: {
            status_of_request: ['Cancelled by Student', 'Cancelled by Staff', 'Released'],
        },
        include: [
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
            'document_request_evaluation',
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Requests History has been retrieved',
                'No Requests History has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

exports.fetchOicRecords = (req, res) => {
    const v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Role.findOne({ where: { role_name: 'OIC, Student Records' } })
        .then(data => {
            db.UserRole.findOne({
                where: { role_id: data.role_id },
                include: [
                    {
                        model: db.User,
                        as: 'user_assigned_to_role',
                        include: [
                            {
                                model: db.UserProfile,
                                as: 'user_profiles',
                            },
                        ],
                    },
                ],
            })
                .then(data => {
                    dataResponse(
                        res,
                        data,
                        'A Record has been identified',
                        'No Record has been identified'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

function createRequestSignatories(data) {
    const requestSignatoryData = []

    data.documents_assigned_to_request.forEach(docReq => {
        const docReqData = {
            request_id: docReq.request_id,
            document_id: docReq.document_id,
        }

        docReq.document_information[0].document_signatories.forEach(docSign => {
            requestSignatoryData.push({
                ...docReqData,
                user_id: docSign.user_id,
                hierarchy_number: docSign.hierarchy_number,
            })
        })
    })

    db.Request_Signatory.bulkCreate(requestSignatoryData).then(result => {
        console.log('Document Request Signatories have been created')
    })
}
