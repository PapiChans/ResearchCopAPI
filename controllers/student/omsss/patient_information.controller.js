// ? ======================================================================
// ? PATIENT INFORMATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { BlobServiceClient } = require('@azure/storage-blob')

// % View Patient Information of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/patient_information (GET)
exports.viewPatientInformation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Patient_Information.findOne({
        where: { user_id: user_id },
        include: [
            {
                model: db.User,
                as: 'patient_info_assigned_to_user',
                attributes: ['user_id', 'user_no', 'user_type'],
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        // attributes: ['email_address', 'contact_number'],
                    },
                ],
            },
        ],
    })
        .then(data => {
            if (data == null) {
                // >> Goal: Gusto ko makuha yung user_id ng user para magkaroon na
                // >> siya ng sariling patient_information_id secretly sa database.
                // >> if meron na, get na lang para ma populate sa input boxes.

                const addPatientInfo = {
                    user_id: user_id,
                }

                db.Patient_Information.create(addPatientInfo)
                    .then(data => {
                        // Kapag nag create na ng patient information kailangan kunin
                        // ko rin yung data ng email_address at contact_number
                        // para mapopulate naman sa respective input boxes nila.
                        db.Patient_Information.findOne({
                            where: { user_id: user_id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient_info_assigned_to_user',
                                    // attributes: ['user_id', 'user_no', 'user_type'],
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
                                    'Patient Information has been created',
                                    'Patient Information has not been created'
                                )
                            })
                            .catch(err => errResponse(res, err))
                    })
                    .catch(err => errResponse(res, err))
            } else {
                dataResponse(
                    res,
                    data,
                    'Patient Information has been retrieved',
                    'Patient Information has not been retrieved'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// % Edit Patient Information of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/patient_information (PUT)
exports.editPatientInformation = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    Object.keys(req.body).forEach(key => {
        if (req.body[key] === '') req.body[key] = null
    })

    if (req.files) {
        req.files.forEach(file => {
            if (file.fieldname == 'philhealth_id_image') {
                req.body.philhealth_id_image = file.blobName
            }
        })
    }

    db.Patient_Information.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            // kapag meron na data (which is usually meron na)
            // (dahil sa get request na ginawa ko sa taas)
            if (data != null) {
                db.Patient_Information.update(req.body, {
                    where: { user_id: user_id },
                })
                    .then(data => {
                        if (data[0] == 1) {
                            db.Patient_Information.findOne({
                                where: { user_id: user_id },
                            })
                                .then(resultData => {
                                    dataResponse(
                                        res,
                                        resultData,
                                        'Patient Information has been updated',
                                        'Patient Information has not been updated'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        }
                    })
                    .catch(err => errResponse(res, err))
            }
            // kapag wala, call errResponse.
            else {
                errResponse(res, 'Patient Information has not been updated')
            }
        })
        .catch(err => errResponse(res, err))
}

// % Delete Philhealth ID Image of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/patient_information/philhealth_id_image
exports.deletePhilhealthIDImage = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Patient_Information.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data != null) {
                if (data.philhealth_id_image != null) {
                    const blobName = data.philhealth_id_image.split('/')[4]
                    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
                    const container = 'philhealth-id-attachments'
                    const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                        .getContainerClient(container)
                        .getBlobClient(blobName)

                    blobClient.deleteIfExists().then(result => {
                        console.log(result._response.status + ' blob removed')
                        db.Patient_Information.update(
                            { philhealth_id_image: null },
                            { where: { user_id: user_id } }
                        )
                            .then(data => {
                                if (data[0] == 1) {
                                    db.Patient_Information.findOne({
                                        where: { user_id: user_id },
                                    })
                                        .then(resultData => {
                                            dataResponse(
                                                res,
                                                resultData,
                                                'Philhealth ID Image has been deleted',
                                                'Philhealth ID Image has not been deleted'
                                            )
                                        })
                                        .catch(err => errResponse(res, err))
                                }
                            })
                            .catch(err => errResponse(res, err))
                    })
                }
            } else {
                errResponse(res, 'Philhealth ID Image has not been deleted')
            }
        })
        .catch(err => errResponse(res, err))
}
