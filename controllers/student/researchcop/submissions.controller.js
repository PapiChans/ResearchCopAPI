const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { BlobServiceClient } = require('@azure/storage-blob')

// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.viewAllMyResearchSubmissions = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
    })

        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.viewMyResearchSubmissions = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            user_id: req.user.user_id,
            research_category: 'Research',
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
    })

        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

exports.viewMyCapstoneSubmissions = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            user_id: req.user.user_id,
            research_category: 'Capstone',
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
    })

        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the information of the currently logged in user.
// % ROUTE: /mypupqc/v1/super_admin/info
exports.getAuthor = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    db.UserProfile.findOne({
        where: {
            user_id: req.user.user_id,
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no'],
                as: 'user_profile',
            },
        ],
    })
        .then(data =>
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        )
        .catch(err => errResponse(res, err))
}

// % Add a new Research
// % ROUTE: /mypupqc/v1/student/my-submissions/add
exports.addMySubmissions = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const mySubmissionsBody = {
        user_id: req.user.user_id,
        research_title: req.body.research_title,
        research_author: req.body.research_author,
        research_co_author: req.body.research_co_author,
        research_abstract: req.body.research_abstract,
        research_date_accomplished: req.body.research_date_accomplished,
        research_adviser: req.body.research_adviser,
        research_program: req.body.research_program,
        research_status: 'Pending',
        research_type: 'Non-Copyrighted',
        research_category: req.body.research_category,
    }

    db.ResearchDetails.create(mySubmissionsBody)
        .then(data => {
            dataResponse(res, data, 'Research Added.', 'No Research Added.')
        })
        .catch(err => errResponse(res, err))
}

// % Add a new Research
// % ROUTE: /mypupqc/v1/student/my-submissions/add
exports.resubmitResearch = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const mySubmissionsBody = {
        research_title: req.body.research_title,
        research_co_author: req.body.research_co_author,
        research_abstract: req.body.research_abstract,
        research_date_accomplished: req.body.research_date_accomplished,
        research_adviser: req.body.research_adviser,
        research_program: req.body.research_program,
        research_status: 'Pending',
        research_category: req.body.research_category,
    }

    db.ResearchDetails.update(mySubmissionsBody,{ where: {research_id: req.params.research_id}})
        .then(data => {
            dataResponse(res, data, 'Research Added.', 'No Research Added.')
        })
        .catch(err => errResponse(res, err))
}

// % View Specific Research Records available based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/student/my_submissions/:research_id
exports.viewSpecificResearchRecords = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
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
    let v = checkAuthorization(req, res, 'Student')
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

// % Reupload/Upload Research Record of the currently selected Research.
// % ROUTE: /mypupqc/v1/student/researchcop/my-submissions/upload (PUT)
exports.uploadMySubmissions = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const ResearchInfoBody = {
        research_id: req.params.research_id,
    }

    if (req.files) {
        req.files.forEach(file => {
            if (file.fieldname == 'research_pdf') {
                ResearchInfoBody['research_pdf'] = file.blobName
            }
        })
    }

    // >> Hanapin muna kung meron na nag-eexist na researh_id sa table na ito. (Research table)

    db.ResearchDetails.findOne({
        where: { research_id: req.params.research_id },
    })
        .then(data => {
            if (data == null) {
                // >> Kapag wala, create na lang ng bagong record.
                db.ResearchDetails.create(ResearchInfoBody)
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'A Record has been identified',
                            'No Record has been identified'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else {
                // >> Kapag meron, update na lang ng existing record.
                db.ResearchDetails.update(ResearchInfoBody, {
                    where: { research_id: req.params.research_id },
                })
                    .then(data => {
                        db.ResearchDetails.findOne({
                            where: { research_id: req.params.research_id },
                        })
                            .then(resultData => {
                                dataResponse(
                                    res,
                                    resultData,
                                    'A Record has been identified',
                                    'No Record has been identified'
                                )
                            })
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Delete Research Document of the currently selected Research.
// % ROUTE: /mypupqc/v1/omsss/student/researchcop/my-submissions/deleteupload
exports.deleteResearchUpload = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const research_id = req.params.research_id

    db.ResearchDetails.findOne({
        where: { research_id: req.params.research_id },
    })
        .then(data => {
            if (data != null) {
                if (data.research_pdf != null) {
                    const blobName = data.research_pdf.split('/')[4]
                    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
                    const container = 'research-attachments'
                    const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                        .getContainerClient(container)
                        .getBlobClient(blobName)

                    blobClient.deleteIfExists().then(result => {
                        console.log(result._response.status + ' blob removed')
                        db.ResearchDetails.update(
                            { research_pdf: null },
                            { where: { research_id: req.params.research_id } }
                        )
                            .then(data => {
                                if (data[0] == 1) {
                                    db.ResearchDetails.findOne({
                                        where: { research_id: req.params.research_id },
                                    })
                                        .then(resultData => {
                                            dataResponse(
                                                res,
                                                resultData,
                                                'Research Document has been deleted',
                                                'Research Document has not been deleted'
                                            )
                                        })
                                        .catch(err => errResponse(res, err))
                                }
                            })
                            .catch(err => errResponse(res, err))
                    })
                }
            } else {
                errResponse(res, 'Research Document has not been deleted')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Reupload/Upload Copyright Document of the currently selected Research.
// % ROUTE: /mypupqc/v1/student/researchcop/my-submissions/copyrightupload (PUT)
exports.uploadCopyright = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const ResearchInfoBody = {
        research_id: req.params.research_id,
        copyright_status: 'Reviewing',
    }

    if (req.files) {
        req.files.forEach(file => {
            if (file.fieldname == 'copyright_pdf') {
                ResearchInfoBody['copyright_pdf'] = file.blobName
            }
        })
    }

    // >> Hanapin muna kung meron na nag-eexist na researh_id sa table na ito. (Research table)

    db.ResearchDetails.findOne({
        where: { research_id: req.params.research_id },
    })
        .then(data => {
            if (data == null) {
                // >> Kapag wala, create na lang ng bagong record.
                db.ResearchDetails.create(ResearchInfoBody)
                    .then(data => {
                        dataResponse(
                            res,
                            data,
                            'A Record has been identified',
                            'No Record has been identified'
                        )
                    })
                    .catch(err => errResponse(res, err))
            } else {
                // >> Kapag meron, update na lang ng existing record.
                db.ResearchDetails.update(ResearchInfoBody, {
                    where: { research_id: req.params.research_id },
                })
                    .then(data => {
                        db.ResearchDetails.findOne({
                            where: { research_id: req.params.research_id },
                        })
                            .then(resultData => {
                                dataResponse(
                                    res,
                                    resultData,
                                    'A Record has been identified',
                                    'No Record has been identified'
                                )
                            })
                    })
                    .catch(err => errResponse(res, err))
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Delete Research Document of the currently selected Research.
// % ROUTE: /mypupqc/v1/omsss/student/researchcop/my-submissions/deletecopyrightupload
exports.deleteCopyrightUpload = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const research_id = req.params.research_id

    db.ResearchDetails.findOne({
        where: { research_id: req.params.research_id },
    })
        .then(data => {
            if (data != null) {
                if (data.copyright_pdf != null) {
                    const blobName = data.copyright_pdf.split('/')[4]
                    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
                    const container = 'copyright-attachments'
                    const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                        .getContainerClient(container)
                        .getBlobClient(blobName)

                    blobClient.deleteIfExists().then(result => {
                        console.log(result._response.status + ' blob removed')
                        db.ResearchDetails.update(
                            { copyright_pdf: null, research_type: 'Non-Copyrighted', copyright_status: 'No Upload' },
                            { where: { research_id: req.params.research_id } }
                        )
                            .then(data => {
                                if (data[0] == 1) {
                                    db.ResearchDetails.findOne({
                                        where: { research_id: req.params.research_id },
                                    })
                                        .then(resultData => {
                                            dataResponse(
                                                res,
                                                resultData,
                                                'Copyright Document has been deleted',
                                                'Copyright Document has not been deleted'
                                            )
                                        })
                                        .catch(err => errResponse(res, err))
                                }
                            })
                            .catch(err => errResponse(res, err))
                    })
                }
            } else {
                errResponse(res, 'Copyright Document has not been deleted')
            }
        })
        .catch(err => errResponse(res, err))
}