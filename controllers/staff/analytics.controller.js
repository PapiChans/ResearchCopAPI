// ? ======================================================================
// ? ANALYTICS CONTROLLER
// ? This controller is for queries related to staff analytics.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')

// % Notes:
// % Since marami tayong analytics per user_type, gamitin na lang natin analytics.controller.js
// % para sa lahat. Hatiin na lang using lines/comments.

// * ======================================================================
// * ANALYTICS CONTROLLER - OMSSS
// * This controller is for queries related to staff analytics specifically
// * for OMSSS team.
// * ======================================================================

// >> Start code here
// % Get the number of Consultation Status in the Database in the following conditions: [Done, Pending, Approved]
// % ROUTE: /mypupqc/v1/staff/analytics/consultation_status_count
exports.getConsultationStatusCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    let appointment_type = req.params.appointment_type // * ['Medical', 'Dental', 'Guidance']

    db.Health_Appointment.count({
        col: 'consultation_status',
        group: ['consultation_status'],
        where: {
            appointment_type: appointment_type,
        },
    })
        .then(result => {
            consultationStatusCount = {
                done: 0,
                pending: 0,
                approved: 0,
                cancelled_by_staff: 0,
                cancelled_by_student: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.consultation_status === 'Done') consultationStatusCount.done = count
                if (element.consultation_status === 'Pending')
                    consultationStatusCount.pending = count
                if (element.consultation_status === 'Approved')
                    consultationStatusCount.approved = count
                if (element.consultation_status === 'Cancelled by Staff')
                    consultationStatusCount.cancelled_by_staff = count
                if (element.consultation_status === 'Cancelled by Student')
                    consultationStatusCount.cancelled_by_student = count
            })

            // Send userCount object
            res.send({ consultation_status_count: consultationStatusCount })
        })
        .catch(err => errResponse(res, err))
}

// * ======================================================================
// * ANALYTICS CONTROLLER - ODRS
// * This controller is for queries related to staff analytics specifically
// * for ODRS team.
// * ======================================================================

// >> Start code here
// % Get the number of requests in the Requests table
// % ROUTE: /mypupqc/v1/odrs/pup_staff/analytics/requests
exports.getRequestsPageAnalytics = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    // Get the number of Requests in the Database in the following conditions: [Pending for Clearance, For Clearance, For Evaluation, Ready for Pickup]
    db.Request.count({
        col: 'status_of_request',
        group: ['status_of_request'],
    }).then(result => {
        requestStatusCount = {
            pending_for_clearance: 0,
            for_clearance: 0,
            for_evaluation: 0,
            ready_for_pickup: 0,
        }

        result.forEach(element => {
            var count = element.count

            // Get count per user
            if (element.status_of_request === 'Pending for Clearance')
                requestStatusCount.pending_for_clearance = count
            if (element.status_of_request === 'For Clearance')
                requestStatusCount.for_clearance = count
            if (element.status_of_request === 'For Evaluation/Processing')
                requestStatusCount.for_evaluation = count
            if (element.status_of_request === 'Ready for Pickup')
                requestStatusCount.ready_for_pickup = count
        })

        // Send userCount object
        res.send({ request_status_count: requestStatusCount })
    })
}

// % Get the number of request history in the Requests table
// % ROUTE: /mypupqc/v1/odrs/pup_staff/analytics/history
exports.getHistoryPageAnalytics = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    // Get the number of Requests in the Database in the following conditions: [Released, Cancelled by Student, Cancelled by Staff]
    db.Request.count({
        col: 'status_of_request',
        group: ['status_of_request'],
    }).then(result => {
        requestStatusCount = {
            released: 0,
            cancelled_by_student: 0,
            cancelled_by_staff: 0,
        }

        result.forEach(element => {
            var count = element.count

            // Get count per user
            if (element.status_of_request === 'Released') requestStatusCount.released = count
            if (element.status_of_request === 'Cancelled by Student')
                requestStatusCount.cancelled_by_student = count
            if (element.status_of_request === 'Cancelled by Staff')
                requestStatusCount.cancelled_by_staff = count
        })

        // Send userCount object
        res.send({ request_status_count: requestStatusCount })
    })
}

// * ======================================================================
// * ANALYTICS CONTROLLER - EVRSERS
// * This controller is for queries related to staff analytics specifically
// * for EVRSERS team.
// * ======================================================================

// >> Start code here
