const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

require('dotenv').config()

// % View all Organizers
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_organizers
exports.viewOrganizerStudents = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
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

// % Add Organizer role to parameter (student)[:user_id]
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/set_organizer_role/:user_id
exports.setOrganizerRoleStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.User.findOne({ where: { user_id: req.params.user_id } }).then(data => {
        if (data.user_type == 'Student') {
            db.Role.findOne({ where: { role_name: 'Organizer' } })
                .then(data => {
                    let organizerBody = {
                        user_id: req.params.user_id,
                        role_id: data.role_id,
                    }
                    db.UserRole.findOne({
                        where: organizerBody,
                    })
                        .then(data => {
                            if (data == null) {
                                db.UserRole.create(organizerBody)
                                    .then(data =>
                                        dataResponse(
                                            res,
                                            data,
                                            'Role Organizer successfully added.',
                                            'No such User has been identified.'
                                        )
                                    )
                                    .catch(err => errResponse(res, err))
                            } else {
                                db.User.findOne({ where: { user_id: req.params.user_id } })
                                    .then(data => {
                                        if (data.user_type == 'Student') {
                                            db.UserRole.destroy({ where: organizerBody })
                                                .then(data =>
                                                    dataResponse(
                                                        res,
                                                        data,
                                                        'Role Organizer successfully removed.',
                                                        'No such User has been identified.'
                                                    )
                                                )
                                                .catch(err => errResponse(res, err))
                                        } else {
                                            errResponse(res, 'User is not a Student.')
                                        }
                                    })
                                    .catch(err => errResponse(res, err))
                            }
                        })
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        } else {
            errResponse(res, 'User is not a Student')
        }
    })
}

// % View specific information of student
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_student/:user_id

exports.viewStudentStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.User.findOne({
        where: {
            user_id: req.params.user_id,
        },
        include: [
            {
                model: db.UserProfile,
                as: 'user_profiles',
            },
        ],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Student has no Organizer role
// % ROUTE: /mypupqc/v1/evrsers/pup_staff/view_student_no_organizer
exports.viewStudentNoOrganizerStaff = (req, res, next) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.UserRole.findAll()
        .then(data => {
            let userWithRoles = []
            data.forEach(element => {
                if (!userWithRoles.includes(element.user_id)) {
                    userWithRoles.push(element.user_id)
                }
            })
            db.User.findAll({
                where: {
                    user_type: 'Student',
                    user_id: { [Op.notIn]: userWithRoles },
                },
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
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
