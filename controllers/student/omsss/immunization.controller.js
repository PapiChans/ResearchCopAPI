// ? ======================================================================
// ? IMMUNIZATION CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { BlobServiceClient } = require('@azure/storage-blob')

// % View the Immunization Record of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/view_immunization (GET)
exports.viewImmunization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Immunization.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Reupload/Upload Immunization Record of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/edit_immunization (PUT)
exports.editImmunization = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const vaccinationInfoBody = {
        user_id: req.user.user_id,
    }

    if (req.files) {
        req.files.forEach(file => {
            if (file.fieldname == 'vaccination_card') {
                vaccinationInfoBody.vaccination_card = file.blobName
            }
        })
    }

    // >> Hanapin muna kung meron na nag-eexist na user_id sa table na ito. (immunization table)

    db.Immunization.findOne({
        where: { user_id: req.user.user_id },
    })
        .then(data => {
            if (data == null) {
                // >> Kapag wala, create na lang ng bagong record.
                db.Immunization.create(vaccinationInfoBody)
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
                db.Immunization.update(vaccinationInfoBody, {
                    where: { user_id: req.user.user_id },
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
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}

// % Delete Vaccination Card Record of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/delete_vaccination_card
exports.deleteVaccinationCard = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Immunization.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data != null) {
                if (data.vaccination_card != null) {
                    const blobName = data.vaccination_card.split('/')[4]
                    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING
                    const container = 'vaccination-card-attachments'
                    const blobClient = BlobServiceClient.fromConnectionString(connectionString)
                        .getContainerClient(container)
                        .getBlobClient(blobName)

                    blobClient.deleteIfExists().then(result => {
                        console.log(result._response.status + ' blob removed')
                        db.Immunization.update(
                            { vaccination_card: null },
                            { where: { user_id: user_id } }
                        )
                            .then(data => {
                                if (data[0] == 1) {
                                    db.Immunization.findOne({
                                        where: { user_id: user_id },
                                    })
                                        .then(resultData => {
                                            dataResponse(
                                                res,
                                                resultData,
                                                'Vaccination Card has been deleted',
                                                'Vaccination Card has not been deleted'
                                            )
                                        })
                                        .catch(err => errResponse(res, err))
                                }
                            })
                            .catch(err => errResponse(res, err))
                    })
                } else {
                    emptyDataResponse(res, 'Vaccination Card has not been deleted')
                }
            } else {
                emptyDataResponse(res, 'No Record has been identified')
            }
        })
        .catch(err => {
            errResponse(res, err)
        })
}
