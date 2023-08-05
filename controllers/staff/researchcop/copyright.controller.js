const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const nodemailer = require('nodemailer')
const { BlobServiceClient } = require('@azure/storage-blob')
const mg = require('nodemailer-mailgun-transport')
require('dotenv').config()

// >> Send An Update to the User's Email Address regarding the Research Status
// >> whether if it is Approved or Rejected by the Admin
function sendAppointmentUpdateEmail(res, data) {
    // configure Mailgun transport
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }

    const email_address = data.research_user.user_profiles[0].email_address
    const full_name = data.research_user.user_profiles[0].full_name
    const research_title = data.research_title
    const copyright_status = data.copyright_status
    const copyright_remarks = data.copyright_remarks

    const all_data = {
        data: data,
    }

    let transporter = nodemailer.createTransport(mg(auth))

    // send mail with defined transport object
    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: 'mypupqc@gmail.com',
            subject: `Your Research Copyright has been [${copyright_status}]`,
            text: `Hello ${full_name} your copyright in your research titled [${research_title}] is now  ${copyright_status}.`,
            html: `<h1>Hello ${full_name}</h1><p>Your Copyright document in your research titled [${research_title}] is ${copyright_status}. with the Remarks: ${copyright_remarks}</p>`, // html body
        },
        (err, info) => {
            if (err) {
                console.log(`Error: ${err}`)
                errResponse(res, 'Research update email not sent.')
            } else {
                all_data['email_status'] = info
                dataResponse(
                    res,
                    all_data,
                    'Research updated successfully and email update successfully sent.',
                    'Rsearch update not successful, email not sent.'
                )
            }
        }
    )
}

// % View All Research Pending available in the database.
// % ROUTE: /mypupqc/v1/super_admin/iskolarly/
exports.viewAllResearchCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            copyright_status: 'Reviewing',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Pending available in the database.
// % ROUTE: /mypupqc/v1/super_admin/iskolarly/
exports.viewResearchCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            copyright_status: 'Reviewing',
            research_category: 'Research',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Pending available in the database.
// % ROUTE: /mypupqc/v1/super_admin/iskolarly/
exports.viewCapstoneCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            copyright_status: 'Reviewing',
            research_category: 'Capstone',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Research Pending available based on the [:user_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/research-records/:research_id
exports.viewSpecificCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findOne({
        where: {
            research_id: req.params.research_id,
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Rejecting a Research Pending based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/research-pending/approveResearch/:research_id
exports.approvedCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findOne({
        where: {
            research_id: req.params.research_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.copyright_status == 'Reviewing') {
                db.ResearchDetails.update(
                    {
                        copyright_status: 'Approved',
                        research_type: 'Copyrighted',
                        copyright_remarks: 'Your Copyright has been Approved by the Admin',
                        copyright_checked_by: req.body.copyright_checked_by,
                    },
                    {
                        where: {
                            research_id: req.params.research_id,
                        },
                    }
                )
                .then(data => {
                    if (data[0] == 1) {
                        db.ResearchDetails.findOne({
                            where: { research_id: req.params.research_id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'research_user',
                                    attributes: ['user_id', 'user_no', 'user_type'],
                                    include: [
                                        {
                                            seperate: true,
                                            model: db.UserProfile,
                                            as: 'user_profiles',
                                            attributes: ['email_address', 'full_name'],
                                        },
                                    ],
                                },
                            ],
                        })
                            .then(data => {
                                sendAppointmentUpdateEmail(res, data)
                            })
                            .catch(err => errResponse(res, err))
                    }
                })
                .catch(err => errResponse(res, err))
            }
            // Check if Research is Pending
            else {
                db.ResearchDetails.update(
                    {
                        copyright_status: 'Reviewing',
                    },
                    {
                        where: {
                            research_id: req.params.research_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Research Updated Sucessfully',
                            'Research Updated Failed'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}


// % Rejecting a Research Pending based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/research-pending/rejectResearch/:research_id
exports.rejectCopyrightRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findOne({
        where: {
            research_id: req.params.research_id,
        },
    })
        .then(data => {
            // Check if user is Active or is_blacklist=false
            if (data.copyright_status == 'Reviewing') {
                db.ResearchDetails.update(
                    {
                        copyright_status: 'Rejected',
                        copyright_remarks: req.body.copyright_remarks,
                        copyright_checked_by: req.body.copyright_checked_by,
                    },
                    {
                        where: {
                            research_id: req.params.research_id,
                        },
                    }
                )
                .then(data => {
                    if (data[0] == 1) {
                        db.ResearchDetails.findOne({
                            where: { research_id: req.params.research_id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'research_user',
                                    attributes: ['user_id', 'user_no', 'user_type'],
                                    include: [
                                        {
                                            seperate: true,
                                            model: db.UserProfile,
                                            as: 'user_profiles',
                                            attributes: ['email_address', 'full_name'],
                                        },
                                    ],
                                },
                            ],
                        })
                            .then(data => {
                                sendAppointmentUpdateEmail(res, data)
                            })
                            .catch(err => errResponse(res, err))
                    }
                })
                    .catch(err => errResponse(res, err))
            }
            // Check if Research is Pending
            else {
                db.ResearchDetails.update(
                    {
                        copyright_status: 'Reviewing'
                    },
                    {
                        where: {
                            research_id: req.params.research_id,
                        },
                    }
                )
                    .then(data =>
                        dataResponse(
                            res,
                            data,
                            'Research Updated Sucessfully',
                            'Research Updated Failed'
                        )
                    )
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => errResponse(res, err))
}