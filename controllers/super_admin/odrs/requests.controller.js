/* 
 ? ======================================================================
 ? REQUESTS CONTROLLER - SUPER ADMIN
 ? ======================================================================
 */

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % -> View All Requests (Pending for Clearance, For Clearance, For Evaluation/Processing, Ready for Pickup)
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_requests
exports.viewAllRequests = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
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

// % -> View Specific Request
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_request/:request_id
exports.viewSpecificRequest = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
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

// % -> Soft Delete Request
// % ROUTE: /mypupqc/v1/odrs/super_admin/delete_request/:request_id
exports.deleteRequest = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const request_id = req.params.request_id

    db.Request.update(
        {
            status_of_request: 'Deleted',
            deleted: new Date(),
        },
        { where: { request_id: request_id } }
    )
        .then(data => {
            if (data == 1) {
                emptyDataResponse(res, 'Request has been deleted')
            } else errResponse(res, 'Error deleting Request')
        })
        .catch(err => errResponse(res, err))
}

// % -> View Requests History (Cancelled by Student, Cancelled by Staff, Deleted, Released)
// % ROUTE: /mypupqc/v1/odrs/super_admin/view_requests_history
exports.viewRequestsHistory = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Request.findAll({
        where: {
            status_of_request: [
                'Cancelled by Student',
                'Cancelled by Staff',
                'Deleted',
                'Released',
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
                'Requests History has been retrieved',
                'No Requests History has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Request History Status
// % ROUTE: /mypupqc/v1/odrs/super_admin/requests_history/:type_of_status
exports.viewRequestsHistoryStatus = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const type_of_status =
        req.params.type_of_status === 'Cancelled'
            ? ['Cancelled by Student', 'Cancelled by Staff']
            : req.params.type_of_status

    db.Request.findAll({
        where: {
            status_of_request: type_of_status,
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
                'Requests History has been retrieved',
                'No Requests History has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

exports.fetchOicRecords = (req, res) => {
    const v = checkAuthorization(req, res, 'Super Admin')
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
