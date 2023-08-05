/* 
 ? ======================================================================
 ? REQUESTS CONTROLLER - STUDENT
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
const { sendRequestUpdateEmail } = require('../../../helpers/emailSending')

// % -> Add New Requests
// % ROUTE: /mypupqc/v1/odrs/student/add_request
exports.addRequest = async (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    const noOfRequests = await db.Request.count({
        where: {
            user_id: req.user.user_id,
            status_of_request: {
                [Op.notIn]: ['Released', 'Cancelled by Student', 'Cancelled by Staff', 'Deleted'],
            },
        },
    })

    if (v != null) return v
    if (noOfRequests >= 1)
        return errResponse(
            res,
            'Existing request was found! You can only have 1 request at a time. You may cancel your existing request to create a new request.'
        )
    if (req.body.data.length === 1) return errResponse(res, 'No Documents have been selected')
    if (req.body.data.length > 4) return errResponse(res, 'Maximum of 3 documents only')

    const requestData = {
        user_id: req.user.user_id,
        control_no: `CTRL-${Date.now() * 2}`,
        status_of_request: 'Pending for Clearance',
        purpose_of_request: req.body.data[0].purpose_of_request,
        payment_status: 'Pending',
        pending_for_clearance: new Date(),
    }

    db.Request.create(requestData)
        .then(result => {
            req.body.data.shift()
            req.body.data.forEach(e => {
                e.request_id = result.request_id
            })

            db.Document_Request.bulkCreate(req.body.data)
                .then(data => {
                    db.Request.findByPk(result.request_id, {
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
                            sendRequestUpdateEmail(res, data)
                        })
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Requests of the logged in student
// % ROUTE: /mypupqc/v1/odrs/student/view_requests
exports.viewAllRequests = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Request.findAll({
        where: {
            status_of_request: [
                'Pending for Clearance',
                'For Clearance',
                'For Evaluation/Processing',
                'Ready for Pickup',
            ],
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['education_profile'],
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

// % -> View the User Request
// % ROUTE: /mypupqc/v1/odrs/student/view_request
exports.viewUserRequest = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Request.findOne({
        where: {
            user_id: req.user.user_id,
            status_of_request: [
                'Pending for Clearance',
                'For Clearance',
                'For Evaluation/Processing',
                'Ready for Pickup',
            ],
        },
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

// % -> View Specific Request of the logged in student
// % ROUTE: /mypupqc/v1/odrs/student/view_request/:request_id
exports.viewSpecificRequest = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
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
        ],
    })
        .then(data => {
            dataResponse(res, data, 'Request has been retrieved', 'No Request has been retrieved')
        })
        .catch(err => errResponse(res, err))
}

// % -> View Documents Requirements
// % ROUTE: /mypupqc/v1/odrs/student/view_documents_requirements/:request_id
exports.viewDocumentsRequirements = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Document_Request.findAll({
        where: { request_id: req.params.request_id },
        include: [
            {
                model: db.Document,
                paranoid: false,
                as: 'document_information',
                include: ['document_requirements'],
            },
        ],
    })
        .then(data => {
            const finalData = []

            data.forEach(e => {
                finalData.push(e.document_information[0])
            })
            dataResponse(
                res,
                finalData,
                'Document Requirements have been retrieved',
                'No Document Requirements have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> Cancel Request
// % ROUTE: /mypupqc/v1/odrs/student/update_request_status/:status
exports.updateRequestStatus = async (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const request_id = await db.Request.findOne({
        where: {
            user_id: req.user.user_id,
            status_of_request: [
                'Pending for Clearance',
                'For Clearance',
                'For Evaluation/Processing',
                'Ready for Pickup',
            ],
        },
    })

    db.Request.update(
        {
            status_of_request: req.params.status,
            cancelled: Date.now(),
            payment_status: 'Cancelled',
            expiration: null,
        },
        {
            where: {
                request_id: request_id.request_id,
            },
        }
    )
        .then(result => {
            if (result == 1) {
                db.Request.findOne({
                    where: {
                        request_id: request_id.request_id,
                    },
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
                        sendRequestUpdateEmail(res, data)
                    })
                    .catch(err => errResponse(res, err))
            } else errResponse(res, 'Error in cancelling Request')
        })
        .catch(err => errResponse(res, err))
}

// % -> View Requests History(Released, Cancelled by Student, Cancelled by Staff)
// % ROUTE: /mypupqc/v1/odrs/student/view_requests_history
exports.viewRequestsHistory = (req, res) => {
    const v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Request.findAll({
        where: {
            status_of_request: ['Cancelled by Student', 'Cancelled by Staff', 'Released'],
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['education_profile'],
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
    const v = checkAuthorization(req, res, 'Student')
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
