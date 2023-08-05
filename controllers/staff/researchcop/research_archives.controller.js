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
    const research_status = data.research_status
    const research_remarks = data.research_remarks

    const all_data = {
        data: data,
    }

    let transporter = nodemailer.createTransport(mg(auth))

    // send mail with defined transport object
    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: 'mypupqc@gmail.com',
            subject: `Your Research has been [${research_status}]`,
            text: `Hello ${full_name} your research titled [${research_title}] is ${research_status}.`,
            html: `<h1>Hello ${full_name}</h1><p>Your research titled [${research_title}] is ${research_status}. with the Remarks: ${research_remarks}</p>`, // html body
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

// % View All Research Deleted available in the database.
// % ROUTE: /mypupqc/v1/iskolarly/research-archives
exports.viewAllResearchArchives = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            research_status: 'Archived',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}


// % View All Research Deleted available in the database.
// % ROUTE: /mypupqc/v1/iskolarly/research-archives
exports.viewResearchArchives = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            research_status: 'Archived',
            research_category: 'Research',
        },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Deleted available in the database.
// % ROUTE: /mypupqc/v1/iskolarly/research-archives
exports.viewCapstoneArchives = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.ResearchDetails.findAll({
        where: {
            research_status: 'Archived',
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
exports.viewSpecificResearchArchives = (req, res, next) => {
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

// % View Specific Research Records available based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/student/my_submissions/remarks/:research_id
exports.viewSpecificResearchRemarks = (req, res, next) => {
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


// % Returning a Research Records based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/super_admin/research-archives/returnResearch/:research_id
exports.returnResearchRecords = (req, res, next) => {
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
            if (data.research_status == 'Archived') {
                db.ResearchDetails.update(
                    {
                        research_status: 'Approved',
                        research_remarks: req.body.research_remarks,
                        research_checked_by: req.body.research_checked_by,
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
                        research_status: 'Archived',
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