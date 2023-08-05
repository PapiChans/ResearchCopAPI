// ? ======================================================================
// ? ANALYTICS CONTROLLER
// ? This controller is for queries related to admin dashboard.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const { Op } = require('sequelize')
const moment = require('moment')

// % Notes:
// % Since marami tayong analytics per user_type, gamitin na lang natin analytics.controller.js
// % para sa lahat. Hatiin na lang using lines/comments.

// * ======================================================================
// * ANALYTICS CONTROLLER - GENERAL ANALYTICS
// * This controller is for general analytics related to users and roles.
// * ======================================================================

// % Gets the number of users registered in the admin by their user type.
// % ROUTE: /mypupqc/v1/super_admin/analytics/user_count
exports.getUsersCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.count({
        col: 'user_type',
        group: ['user_type'],
    })
        .then(result => {
            userCount = {
                all: 0,
                student: 0,
                pup_staff: 0,
            }

            result.forEach(element => {
                var count = element.count
                userCount.all += count

                // Get count per user
                if (element.user_type === 'Student') userCount.student = count
                if (element.user_type === 'PUP Staff') userCount.pup_staff = count
            })

            data = {
                user_count: userCount,
            }

            // Send userCount object
            dataResponse(res, data, 'User Count found', 'No User Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of users based on their roles.
// % ROUTE: /mypupqc/v1/super_admin/analytics/user_role_count
exports.getUsersRoleCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.UserRole.findAll({
        attributes: ['role_id', 'user_id'],
        include: [
            {
                model: db.Role,
                as: 'role_assigned_to_user',
                attributes: ['role_name'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_role',
                attributes: ['user_id', 'user_no'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(result => {
            // Get all roles
            db.Role.findAll({
                attributes: ['role_id', 'role_name'],
            })
                .then(roles => {
                    // Initialize roleCount object
                    roleCount = {}
                    roles.forEach(role => {
                        roleCount[role.role_name] = 0
                    })

                    // Get count per role
                    result.forEach(element => {
                        roleCount[element.role_assigned_to_user.role_name]++
                    })

                    data = {
                        role_count: roleCount,
                    }

                    // Send userCount object
                    dataResponse(res, data, 'Role Count found', 'No Role Count found')
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of users that are blacklisted and not.
// % ROUTE: /mypupqc/v1/super_admin/analytics/user_blacklist_count
exports.getUsersBlacklistCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.count({
        col: 'is_blacklist',
        group: ['is_blacklist'],
    })
        .then(result => {
            blacklistCount = {
                Blacklisted: 0,
                NotBlacklisted: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.is_blacklist === true) blacklistCount.Blacklisted = count
                if (element.is_blacklist === false) blacklistCount.NotBlacklisted = count
            })

            data = {
                blacklist_count: blacklistCount,
            }

            // Send userCount object
            dataResponse(res, data, 'Blacklist Count found', 'No Blacklist Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of users by their region.
// % ROUTE: /mypupqc/v1/super_admin/analytics/user_region_count
exports.getUsersRegionCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.UserProfile.count({
        col: 'region',
        group: ['region'],
    })
        .then(result => {
            regionCount = {}
            result.forEach(element => {
                regionCount[element.region] = element.count
            })
            data = {
                region_count: regionCount,
            }
            dataResponse(res, data, 'Region Count found', 'No Region Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of announcement types.
// % ROUTE: /mypupqc/v1/super_admin/analytics/announcement_count
exports.getAnnouncementCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Announcement.count({
        col: 'announcement_type',
        group: ['announcement_type'],
    })
        .then(result => {
            announcementCount = {}
            result.forEach(element => {
                announcementCount[element.announcement_type] = element.count
            })
            data = {
                announcement_count: announcementCount,
            }
            dataResponse(res, data, 'Announcement Count found', 'No Announcement Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of Appointments/Requests/Reservations for three tables: Health_Appointment, Request, Reservation
// % ROUTE: /mypupqc/v1/super_admin/analytics/all_system_count
exports.getAllSystemCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count()
        .then(healthAppointmentCount => {
            db.Request.count()
                .then(requestCount => {
                    db.Reservation.count()
                        .then(reservationCount => {
                            data = {
                                health_appointment_count: healthAppointmentCount,
                                request_count: requestCount,
                                reservation_count: reservationCount,
                            }
                            dataResponse(
                                res,
                                data,
                                'All System Count found',
                                'No All System Count found'
                            )
                        })
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Gets the three year count of the number of consultations in Health_Appointment.
// % ROUTE: /mypupqc/v1/super_admin/analytics/getThreeYearAppointmentCount
exports.getThreeYearAppointmentCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'consultation_date',
        group: [db.sequelize.literal('EXTRACT(year FROM consultation_date)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            data = {
                three_year_appointment_count: threeYearCount,
            }
            dataResponse(
                res,
                data,
                'Three Year Appointment Count found',
                'No Three Year Appointment Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Gets the three year count of the number of requests in Request table using created_at column.
// % ROUTE: /mypupqc/v1/super_admin/analytics/three_year_request_count
exports.getThreeYearRequestCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Request.count({
        col: 'created_at',
        group: [db.sequelize.literal('EXTRACT(year FROM created_at)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            data = {
                three_year_request_count: threeYearCount,
            }
            dataResponse(
                res,
                data,
                'Three Year Request Count found',
                'No Three Year Request Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Gets the three year count of the number of reservations in Reservation table using reserve_date column.
// % ROUTE: /mypupqc/v1/super_admin/analytics/three_year_reservation_count
exports.getThreeYearReservationCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.count({
        col: 'reserve_date',
        group: [db.sequelize.literal('EXTRACT(year FROM reserve_date)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            data = {
                three_year_reservation_count: threeYearCount,
            }
            dataResponse(
                res,
                data,
                'Three Year Reservation Count found',
                'No Three Year Reservation Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Gets the three year count of three tables: Health_Appointment, Request, Reservation
// % ROUTE: /mypupqc/v1/super_admin/analytics/three_year_all_system_count
exports.getThreeYearAllSystemCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    const healthAppointmentCount = await db.Health_Appointment.count({
        col: 'consultation_date',
        group: [db.sequelize.literal('EXTRACT(year FROM consultation_date)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            return (data = {
                three_year_appointment_count: threeYearCount,
            })
        })
        .catch(err => errResponse(res, err))

    const requestCount = await db.Request.count({
        col: 'created_at',
        group: [db.sequelize.literal('EXTRACT(year FROM created_at)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            return (data = {
                three_year_request_count: threeYearCount,
            })
        })
        .catch(err => errResponse(res, err))

    const reservationCount = await db.Reservation.count({
        col: 'reserve_date',
        group: [db.sequelize.literal('EXTRACT(year FROM reserve_date)')],
    })
        .then(result => {
            threeYearCount = {}
            result.forEach(element => {
                const year = element.date_part
                const count = element.count
                threeYearCount[year] = count
            })
            return (data = {
                three_year_reservation_count: threeYearCount,
            })
        })
        .catch(err => errResponse(res, err))

    data = {
        health_appointment_count: healthAppointmentCount.three_year_appointment_count,
        request_count: requestCount.three_year_request_count,
        reservation_count: reservationCount.three_year_reservation_count,
    }

    if (!data) {
        return errResponse(res, 'No data found')
    }
    dataResponse(
        res,
        data,
        'Three Year All System Count found',
        'No Three Year All System Count found'
    )
}

// * ======================================================================
// * ANALYTICS CONTROLLER - OMSSS
// * This controller is for queries related to admin analytics specifically
// * for OMSSS team.
// * ======================================================================

// >> Start code here
// % Gets the number of appointments in the Health_Appointments table in Done Status for each appointment_type ["Medical", "Dental", "Guidance"]
// % ROUTE: /mypupqc/v1/omsss/super_admin/analytics/appointment_done_count
exports.getAppointmentDoneCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'appointment_type',
        group: ['appointment_type'],
        where: {
            consultation_status: 'Done',
        },
    })
        .then(result => {
            appointmentDoneCount = {
                Medical: 0,
                Dental: 0,
                Guidance: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.appointment_type === 'Medical') appointmentDoneCount.Medical = count
                if (element.appointment_type === 'Dental') appointmentDoneCount.Dental = count
                if (element.appointment_type === 'Guidance') appointmentDoneCount.Guidance = count
            })

            data = {
                appointment_done_count: appointmentDoneCount,
            }

            dataResponse(
                res,
                data,
                'Appointment Done Count found',
                'No Appointment Done Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of appointments in the Health_Appointments table in Done Status for each appointment_type ["Medical", "Dental", "Guidance"] but filtered with the current year.
// % ROUTE: /mypupqc/v1/omsss/super_admin/analytics/appointment_done_count_annual
exports.getAppointmentDoneCountAnnual = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'appointment_type',
        group: ['appointment_type'],
        where: {
            consultation_status: 'Done',
            created_at: {
                [Op.between]: [
                    moment().startOf('year').format('YYYY-MM-DD'),
                    moment().endOf('year').format('YYYY-MM-DD'),
                ],
            },
        },
    })
        .then(result => {
            appointmentDoneCountAnnual = {
                Medical: 0,
                Dental: 0,
                Guidance: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.appointment_type === 'Medical')
                    appointmentDoneCountAnnual.Medical = count
                if (element.appointment_type === 'Dental') appointmentDoneCountAnnual.Dental = count
                if (element.appointment_type === 'Guidance')
                    appointmentDoneCountAnnual.Guidance = count
            })

            data = {
                appointment_done_count_annual: appointmentDoneCountAnnual,
            }

            dataResponse(
                res,
                data,
                'Appointment Done Count found',
                'No Appointment Done Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of appointments in the Health_Appointments table in Pending Status for each appointment_type ["Medical", "Dental", "Guidance"].
// % ROUTE: /mypupqc/v1/omsss/super_admin/analytics/appointment_pending_count
exports.getAppointmentPendingCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'appointment_type',
        group: ['appointment_type'],
        where: {
            consultation_status: 'Pending',
        },
    })
        .then(result => {
            appointmentPendingCount = {
                Medical: 0,
                Dental: 0,
                Guidance: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.appointment_type === 'Medical') appointmentPendingCount.Medical = count
                if (element.appointment_type === 'Dental') appointmentPendingCount.Dental = count
                if (element.appointment_type === 'Guidance')
                    appointmentPendingCount.Guidance = count
            })

            data = {
                appointment_pending_count: appointmentPendingCount,
            }

            dataResponse(
                res,
                data,
                'Appointment Pending Count found',
                'No Appointment Pending Count found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Get the number of consultation_status: ['Done', 'Cancelled by Staff', 'Cancelled by Student', 'Pending', 'Approved', 'Deleted'] in the Health_Appointments table.
// % ROUTE: /mypupqc/v1/omsss/super_admin/analytics/pie_chart_appointment
exports.getPieChartConsultationStatus = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'consultation_status',
        group: ['consultation_status'],
    })
        .then(result => {
            consultationStatusCount = {
                Done: 0,
                'Cancelled by Staff': 0,
                'Cancelled by Student': 0,
                Pending: 0,
                Approved: 0,
                Deleted: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.consultation_status === 'Done') consultationStatusCount.Done = count
                if (element.consultation_status === 'Cancelled by Staff')
                    consultationStatusCount['Cancelled by Staff'] = count
                if (element.consultation_status === 'Cancelled by Student')
                    consultationStatusCount['Cancelled by Student'] = count
                if (element.consultation_status === 'Pending')
                    consultationStatusCount.Pending = count
                if (element.consultation_status === 'Approved')
                    consultationStatusCount.Approved = count
                if (element.consultation_status === 'Deleted')
                    consultationStatusCount.Deleted = count
            })

            dataResponse(
                res,
                consultationStatusCount,
                'Consultation Status Count found',
                'Consultation Status Count not found'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Get the number of consultation_type count in the Health_Appointments table.
// % ROUTE: /mypupqc/v1/omsss/super_admin/analytics/consultation_type_count
exports.getConsultationTypeCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Health_Appointment.count({
        col: 'consultation_type',
        group: ['consultation_type'],
    })
        .then(result => {
            consultationTypeCount = {
                'New Consultation': 0,
                'Follow Up': 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.consultation_type === 'New Consultation')
                    consultationTypeCount['New Consultation'] = count
                if (element.consultation_type === 'Follow Up')
                    consultationTypeCount['Follow Up'] = count
            })

            dataResponse(
                res,
                consultationTypeCount,
                'Consultation Type Count found',
                'Consultation Type Count not found'
            )
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
// % ROUTE: /mypupqc/v1/odrs/super_admin/analytics/requests
exports.getRequestsPageAnalytics = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
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
// % ROUTE: /mypupqc/v1/odrs/super_admin/analytics/history
exports.getHistoryPageAnalytics = (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    // Get the number of Requests in the Database in the following conditions: [Released, Cancelled by Student, Cancelled by Staff, Deleted]
    db.Request.count({
        col: 'status_of_request',
        group: ['status_of_request'],
    }).then(result => {
        requestStatusCount = {
            released: 0,
            cancelled_by_student: 0,
            cancelled_by_staff: 0,
            deleted: 0,
        }

        result.forEach(element => {
            var count = element.count

            // Get count per user
            if (element.status_of_request === 'Released') requestStatusCount.released = count
            if (element.status_of_request === 'Cancelled by Student')
                requestStatusCount.cancelled_by_student = count
            if (element.status_of_request === 'Cancelled by Staff')
                requestStatusCount.cancelled_by_staff = count
            if (element.status_of_request === 'Deleted') requestStatusCount.deleted = count
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
// % Get the number of active and inactive facilities in the Facilities table.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/analytics/facilities_count
exports.getFacilitiesCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Facilities.count({
        col: 'facility_status',
        group: ['facility_status'],
    })
        .then(result => {
            facilitiesCount = {
                All: 0,
                Available: 0,
                Unavailable: 0,
                Deleted: 0,
            }

            result.forEach(element => {
                console.log(element)
                var count = element.count

                // Get count per user
                if (element.facility_status === 'Available') facilitiesCount.Available = count
                if (element.facility_status === 'Unavailable') facilitiesCount.Unavailable = count
                if (element.facility_status === 'Deleted') facilitiesCount.Deleted = count

                facilitiesCount.All += count
            })

            res.send({ facilities_count: facilitiesCount })
        })
        .catch(err => errResponse(res, err))
}

// % Get the number of annual reservation count in the Reservation table.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/analytics/annual_reservation_count
exports.getAnnualReservationCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.count({
        col: 'reserve_status',
        group: ['reserve_status'],
        where: {
            reserve_status: 'Done',
            created_at: {
                [Op.between]: [
                    moment().startOf('year').format('YYYY-MM-DD'),
                    moment().endOf('year').format('YYYY-MM-DD'),
                ],
            },
        },
    })
        .then(result => {
            reservationCount = {
                Done: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.reserve_status === 'Done') reservationCount.Done = count
            })

            res.send({ reservation_count: reservationCount })
        })
        .catch(err => errResponse(res, err))
}

// % Get the number of reservations made regardless of status in the Reservation table.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/analytics/all_reservation_count
exports.getAllReservationCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Reservation.count({
        col: 'reserve_status',
        group: ['reserve_status'],
    })
        .then(result => {
            reservationCount = {
                'For Review': 0,
                'For Evaluation / Processing': 0,
                'Approved & Released': 0,
                'For Revision': 0,
                Done: 0,
                'Cancelled by Staff': 0,
                'Cancelled by Student': 0,
                Deleted: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per user
                if (element.reserve_status === 'Done') reservationCount['Done'] = count
                if (element.reserve_status === 'Cancelled by Staff')
                    reservationCount['Cancelled by Staff'] = count
                if (element.reserve_status === 'Cancelled by Student')
                    reservationCount['Cancelled by Student'] = count
                if (element.reserve_status === 'For Review') reservationCount['For Review'] = count
                if (element.reserve_status === 'Approved & Released')
                    reservationCount['Approved & Released'] = count
                if (element.reserve_status === 'For Revision')
                    reservationCount['For Revision'] = count
                if (element.reserve_status === 'For Evaluation / Processing')
                    reservationCount['For Evaluation / Processing'] = count
                if (element.reserve_status === 'Deleted') reservationCount['Deleted'] = count
            })

            res.send({ reservation_count: reservationCount })
        })
        .catch(err => errResponse(res, err))
}

// % Get the number of Student and PUP Staff with Organizer role in the Users table.
// % ROUTE: /mypupqc/v1/evrsers/super_admin/analytics/organizer_count
exports.getOrganizerCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Role.findOne({ where: { role_name: 'Organizer' } })
        .then(data => {
            db.UserRole.findAll({
                where: { role_id: data.role_id },
                include: [
                    {
                        model: db.User,
                        as: 'user_assigned_to_role',
                        include: [
                            {
                                model: db.UserProfile,
                                as: 'user_profiles',
                                attributes: ['full_name'],
                            },
                        ],
                    },
                ],
            })
                .then(data => {
                    organizerCount = {
                        all: 0,
                        student: 0,
                        pup_staff: 0,
                    }
                    organizerCount.all = [...data].length
                    data.forEach(element => {
                        if (element.user_assigned_to_role.user_type === 'Student')
                            organizerCount.student += 1
                        if (element.user_assigned_to_role.user_type === 'PUP Staff')
                            organizerCount.pup_staff += 1
                    })
                    console.log(organizerCount)
                    dataResponse(
                        res,
                        organizerCount,
                        'A Record has been identified',
                        'No Record has been identified'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}
