// ? ======================================================================
// ? ORGANIZATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % Add an Organization
// % ROUTE: /mypupqc/v1/orgms/student/add_organization (POST)
exports.addOrganization = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    req.body.user_id = req.user.user_id

    if (!req.files) {
        errResponse(res, 'No file uploaded')
    }

    req.files.forEach(file => {
        console.log(file)
        if (file.fieldname == 'organization_logo') {
            req.body.organization_logo = file.blobName
        }
    })

    db.Organization.create(req.body)
        .then(data => {
            const organization_id = data.organization_id

            req.body.organization_officers.map(officer => {
                officer.organization_id = organization_id
            })

            // ? given req.body.organization_officer, use loop through each user to add a Organizer Role for each officer
            db.Role.findOne({ where: { role_name: 'Organizer' } })
                .then(data => {
                    req.body.organization_officers.forEach(officer => {
                        let organizerBody = {
                            role_id: data.role_id,
                            user_id: officer.user_id,
                        }

                        db.UserRole.create(organizerBody).catch(err => errResponse(res, err))
                    })
                })
                .catch(err => errResponse(res, err))

            // ? after assigning Organizer Role, add the officers to the OrganizationOfficers table
            db.OrganizationOfficers.bulkCreate(req.body.organization_officers)
                .then(data => {
                    const officersAddedLength = data.length

                    db.Organization.findOne({
                        where: {
                            organization_id: organization_id,
                        },
                        include: [
                            {
                                separate: true,
                                model: db.OrganizationOfficers,
                                as: 'officers_assigned_to_organization',
                                include: [
                                    {
                                        model: db.User,
                                        as: 'users_assigned_to_organizations',
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
                            },
                        ],
                    })
                        .then(result =>
                            dataResponse(
                                res,
                                result,
                                'Organization has been added successfully! You have added ' +
                                    officersAddedLength +
                                    ' officers.',
                                'Failed to add an organization.'
                            )
                        )
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % View Organization by user_id (Student who Registered)
// % ROUTE: /mypupqc/v1/orgms/student/view/registration/ (GET)
exports.viewOrganization = (req, res) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.Organization.findOne({
        where: {
            user_id: req.user.user_id,
        },
        include: [
            {
                separate: true,
                model: db.OrganizationOfficers,
                as: 'officers_assigned_to_organization',
                include: [
                    {
                        model: db.User,
                        as: 'users_assigned_to_organizations',
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
            },
        ],
    })
        .then(result =>
            dataResponse(
                res,
                result,
                'An organization has been identified successfully!',
                'No organization has been identified!'
            )
        )
        .catch(err => errResponse(res, err))
}

// % View Student has no Organizer role
// % ROUTE: /mypupqc/v1/orgms/student/view/view_student_no_organizer/ (GET)
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
