// ? ======================================================================
// ? ADMIN POWERS CONTROLLER
// ? This controller is for queries related to what an admin can do.
// ? ======================================================================

const db = require('../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../helpers/controller.helper')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

// * dotenv config
require('dotenv').config()

generatePassword = () => {
    var length = 12
    var charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var password = ''
    for (var i = 0; i < length; i++) {
        var randomIndex = Math.floor(Math.random() * charset.length)
        password += charset[randomIndex]
    }
    return password
}

// >> Send the Password to the Email of the User
sendPasswordToEmail = (res, data, password) => {
    // configure Mailgun transport
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }

    let transporter = nodemailer.createTransport(mg(auth))

    let text = `
        <h1>Your myPUPQC account has been created!</h1>

        <p>Congratulations! Your myPUPQC account has been created. Use your Student ID and then the password below to login to your account.</p>
        <blockquote><b>password</b>: ${password}</blockquote>

        <p>Remember to change your password after logging in to your account through:</p>
        <a href="https://www.mypupqc.live/student/profile/settings">https://www.mypupqc.live/student/profile/settings</a>
        <span><i>This link will only redirect you once you are logged in.</i></span>

        <p>Thank you for using myPUPQC!</p>
        <p>myPUPQC Support</p>
    `

    const all_data = {
        data: data,
    }

    // send mail with defined transport object
    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: 'mypupqc@gmail.com',
            subject: `myPUPQC Student Account: Enrollment`,
            text: `Congratulations! Your myPUPQC account has been created. Use your Student ID and then the password below to login to your account. \n password: ${password}`,
            html: text, // html body
        },
        (err, info) => {
            if (err) {
                console.log(`Error: ${err}`)
                errResponse(res, 'Password not sent. Contact Support if you encounter this.')
            } else {
                all_data['email_status'] = info
                dataResponse(
                    res,
                    all_data,
                    'Created new student account and password sent to email.',
                    'Failed to create new student account'
                )
            }
        }
    )
}

// >> ======================================================================
// >> SUPER ADMIN SECTION
// >> ======================================================================

// % View All Super Admin available in the database.
// % ROUTE: /mypupqc/v1/super_admin/admin/
exports.viewAllSuperAdmin = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Admin.findAll({
        where: {
            user_type: 'Super Admin',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Super Admin available based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/admin/:user_id
exports.viewSpecificSuperAdmin = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Admin.findOne({
        where: {
            user_id: req.params.user_id,
            user_type: 'Super Admin',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Enrolls a new super admin.
// % ROUTE: /mypupqc/v1/super_admin/admin/add
exports.enrollSuperAdmin = async (req, res) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    const userBody = {
        user_no: req.body.user_no,
        user_type: 'Super Admin',
        password: req.body.password,
    }

    const userProfileBody = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        extension_name: req.body.extension_name,
        full_name: req.body.full_name,
        birth_date: req.body.birth_date,
        gender: req.body.gender,
        house_street: req.body.house_street,
        barangay: req.body.barangay,
        municipality: req.body.municipality,
        province: req.body.province,
        region: req.body.region,
        full_address: req.body.full_address,
        contact_number: req.body.contact_number,
        image: req.body.image,
        email_address: req.body.email_address,
        civil_status: req.body.civil_status,
        citizenship: req.body.citizenship,
        religion: req.body.religion,
    }

    db.Admin.create(userBody)
        .then(async data => {
            // >> Assign the user_id generated to the user_id (FK) in the user_profile table.
            userProfileBody['user_id'] = data.user_id

            await db.EducationProfile.create({
                user_id: data.user_id,
            }).catch(err => errResponse(res, err))

            db.UserProfile.create(userProfileBody)
                .then(data =>
                    dataResponse(
                        res,
                        data,
                        'Super Admin successfully enrolled.',
                        'No such super admin has been identified.'
                    )
                )
                .catch(err => {
                    db.Admin.destroy({ where: { admin_id: data.admin_id } }).then(() => {
                        errResponse(res, err)
                    })
                })
        })
        .catch(err => errResponse(res, err))
}

// % Edit a specific super admin based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/admin/edit/:user_id
exports.editSuperAdmin = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    db.UserProfile.update(req.body, { where: { admin_id: req.params.user_id } })
        .then(result => {
            if (result == 1) {
                db.Admin.findByPk(req.params.user_id, {
                    include: ['user_profiles'],
                }).then(resultData => {
                    dataResponse(
                        res,
                        resultData,
                        'Super Admin successfully updated.',
                        'No such super admin has been identified.'
                    )
                })
            } else errResponse(res, 'Error in updating user profile')
        })
        .catch(err => errResponse(res, err))
}

// % Deactivate a specific super admin based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/admin/deactivate/:user_id
exports.deactivateSuperAdmin = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.Admin.findOne({
        where: {
            user_id: req.params.user_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.is_blacklist == false) {
                db.Admin.update(
                    {
                        is_blacklist: true,
                    },
                    {
                        where: {
                            admin_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Super Admin successfully deactivated.',
                            'No such super admin has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
            // Check if user is Inactive or is_blacklist=true
            else {
                db.Admin.update(
                    {
                        is_blacklist: false,
                    },
                    {
                        where: {
                            admin_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Super Admin successfully activated.',
                            'No such super admin has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// >> ======================================================================
// >> STUDENT SECTION
// >> ======================================================================

// % View All Student available in the database.
// % ROUTE: /mypupqc/v1/super_admin/student/
exports.viewAllStudent = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findAll({
        where: {
            user_type: 'Student',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Student available based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/student/:user_id
exports.viewSpecificStudent = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findOne({
        where: {
            user_id: req.params.user_id,
            user_type: 'Student',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Enrolls a new student.
// % ROUTE: /mypupqc/v1/super_admin/student/add
exports.enrollStudent = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    const setNewPassword = generatePassword()

    const userBody = {
        user_no: req.body.user_no,
        user_type: 'Student',
        password: setNewPassword,
    }

    const userProfileBody = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        extension_name: req.body.extension_name,
        full_name: req.body.full_name,
        birth_date: req.body.birth_date,
        gender: req.body.gender,
        house_street: req.body.house_street,
        barangay: req.body.barangay,
        municipality: req.body.municipality,
        province: req.body.province,
        region: req.body.region,
        full_address: req.body.full_address,
        contact_number: req.body.contact_number,
        image: req.body.image,
        email_address: req.body.email_address,
        civil_status: req.body.civil_status,
        citizenship: req.body.citizenship,
        religion: req.body.religion,
    }

    db.User.create(userBody)
        .then(async data => {
            // >> Assign the user_id generated to the user_id (FK) in the user_profile table.
            userProfileBody['user_id'] = data.user_id

            await db.EducationProfile.create({
                user_id: data.user_id,
            }).catch(err => errResponse(res, err))

            db.UserProfile.create(userProfileBody)
                .then(data => {
                    sendPasswordToEmail(res, data, setNewPassword)
                })
                .catch(err => {
                    db.User.destroy({ where: { user_id: data.user_id } }).then(() => {
                        errResponse(res, err)
                    })
                })
        })
        .catch(err => errResponse(res, err))
}

// % Edit a specific student based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/student/edit/:user_id
exports.editStudent = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    db.UserProfile.update(req.body, { where: { user_id: req.params.user_id } })
        .then(result => {
            if (result == 1) {
                db.User.findByPk(req.params.user_id, {
                    include: ['user_profiles'],
                }).then(resultData => {
                    dataResponse(
                        res,
                        resultData,
                        'Student successfully updated.',
                        'No such Student has been identified.'
                    )
                })
            } else errResponse(res, 'Error in updating user profile')
        })
        .catch(err => errResponse(res, err))
}

// % Deactivate a specific student based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/student/deactivate/:user_id
exports.deactivateStudent = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findOne({
        where: {
            user_id: req.params.user_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.is_blacklist == false) {
                db.User.update(
                    {
                        is_blacklist: true,
                    },
                    {
                        where: {
                            user_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Student successfully deactivated.',
                            'No such Student has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
            // Check if user is Inactive or is_blacklist=true
            else {
                db.User.update(
                    {
                        is_blacklist: false,
                    },
                    {
                        where: {
                            user_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Student successfully activated.',
                            'No such Student has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}

// >> ======================================================================
// >> PUP STAFF SECTION
// >> ======================================================================

// % View All PUP Staff available in the database.
// % ROUTE: /mypupqc/v1/super_admin/pup_staff/
exports.viewAllPUPStaff = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findAll({
        where: {
            user_type: 'PUP Staff',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific PUP Staff available based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/pup_staff/:user_id
exports.viewSpecificPUPStaff = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.User.findOne({
        where: {
            user_id: req.params.user_id,
            user_type: 'PUP Staff',
        },
        include: ['user_profiles'],
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Registers a new PUP Staff.
// % ROUTE: /mypupqc/v1/super_admin/pup_staff/add
exports.enrollStaff = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    const userBody = {
        user_no: req.body.user_no,
        user_type: 'PUP Staff',
        password: req.body.password,
    }

    const userProfileBody = {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        extension_name: req.body.extension_name,
        full_name: req.body.full_name,
        birth_date: req.body.birth_date,
        gender: req.body.gender,
        house_street: req.body.house_street,
        barangay: req.body.barangay,
        municipality: req.body.municipality,
        province: req.body.province,
        region: req.body.region,
        full_address: req.body.full_address,
        contact_number: req.body.contact_number,
        image: req.body.image,
        email_address: req.body.email_address,
        civil_status: req.body.civil_status,
        citizenship: req.body.citizenship,
        religion: req.body.religion,
    }

    db.User.create(userBody)
        .then(async data => {
            // >> Assign the user_id generated to the user_id (FK) in the user_profile table.
            userProfileBody['user_id'] = data.user_id

            await db.EducationProfile.create({
                user_id: data.user_id,
            }).catch(err => errResponse(res, err))

            db.UserProfile.create(userProfileBody)
                .then(data =>
                    dataResponse(
                        res,
                        data,
                        'PUP Staff successfully enrolled.',
                        'No such PUP Staff has been identified.'
                    )
                )
                .catch(err => {
                    db.User.destroy({ where: { user_id: data.user_id } }).then(() => {
                        errResponse(res, err)
                    })
                })
        })
        .catch(err => errResponse(res, err))
}

// % Edit a specific PUP Staff based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/pup_staff/edit/:user_id
exports.editStaff = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    req.body.full_name = ''
    req.body.full_address = ''

    if (req.body.extension_name == '') req.body.extension_name = null
    if (req.body.middle_name == '') req.body.middle_name = null

    db.UserProfile.update(req.body, { where: { user_id: req.params.user_id } })
        .then(result => {
            if (result == 1) {
                db.User.findByPk(req.params.user_id, {
                    include: ['user_profiles'],
                }).then(resultData => {
                    dataResponse(
                        res,
                        resultData,
                        'PUP Staff successfully updated.',
                        'No such PUP Staff has been identified.'
                    )
                })
            } else errResponse(res, 'Error in updating user profile')
        })
        .catch(err => errResponse(res, err))
}

// % Deactivate a specific PUP Staff based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/pup_staff/deactivate/:user_id
exports.deactivateStaff = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v
    db.User.findOne({
        where: {
            user_id: req.params.user_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.is_blacklist == false) {
                db.User.update(
                    {
                        is_blacklist: true,
                    },
                    {
                        where: {
                            user_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'PUP Staff successfully deactivated.',
                            'No such PUP Staff has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
            // Check if user is Inactive or is_blacklist=true
            else {
                db.User.update(
                    {
                        is_blacklist: false,
                    },
                    {
                        where: {
                            user_id: req.params.user_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'PUP Staff successfully activated.',
                            'No such PUP Staff has been identified.'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}
