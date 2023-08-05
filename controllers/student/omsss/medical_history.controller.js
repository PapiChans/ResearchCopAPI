// ? ======================================================================
// ? MEDICAL HISTORY CONTROLLER - STUDENT
// ? ======================================================================

const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const crypto = require('crypto')

const ENCRYPTION_KEY = Buffer.from(process.env.OMSSS_ENCRYPTION_KEY, 'hex')

function encrypt(data) {
    const iv = crypto.randomBytes(12)
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv)
    const encrypted = Buffer.concat([cipher.update(data), cipher.final()])
    const tag = cipher.getAuthTag()
    const buffer = Buffer.concat([iv, tag, encrypted])
    return buffer.toString('base64')
}

// % View the Medical History of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/medical_history (GET)
exports.viewMedicalHistory = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    db.Medical_History.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data == null) {
                // >> Ayun kapag wala ulit data, gawa and then
                // >> return the data na nagawa.

                const addPatientInfo = {
                    user_id: user_id,
                }

                db.Medical_History.create(addPatientInfo)
                    .then(data => {
                        db.Medical_History.findOne({
                            where: { user_id: user_id },
                        })
                            .then(data => {
                                dataResponse(
                                    res,
                                    data,
                                    'Medical History has been created',
                                    'Medical History has not been created'
                                )
                            })
                            .catch(err => errResponse(res, err))
                    })
                    .catch(err => errResponse(res, err))
            } else {
                dataResponse(
                    res,
                    data,
                    'Medical History has been retrieved',
                    'Medical History has not been retrieved'
                )
            }
        })
        .catch(err => errResponse(res, err))
}

// % Edit the Medical History of the currently logged in student.
// % ROUTE: /mypupqc/v1/omsss/student/medical_history (PUT)
exports.editMedicalHistory = (req, res, next) => {
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const user_id = req.user.user_id

    // * if the value is empty, set it to null
    Object.keys(req.body).forEach(key => {
        if (req.body[key] === '') req.body[key] = null
    })

    // * encrypt the values
    Object.keys(req.body).forEach(key => {
        const value = req.body[key]
        if (value && typeof value === 'string' && value.length > 0) {
            req.body[key] = encrypt(value)
        }
    })

    console.log('Encrypted: ', req.body)

    db.Medical_History.findOne({
        where: { user_id: user_id },
    })
        .then(data => {
            if (data != null) {
                db.Medical_History.update(req.body, {
                    where: { user_id: user_id },
                })
                    .then(data => {
                        if (data[0] == 1) {
                            db.Medical_History.findOne({
                                where: { user_id: user_id },
                            })
                                .then(resultData => {
                                    dataResponse(
                                        res,
                                        resultData,
                                        'Medical History has been updated',
                                        'Medical History has not been updated'
                                    )
                                })
                                .catch(err => errResponse(res, err))
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        errResponse(res, err)
                    })
            } else {
                errResponse(res, 'Medical History has not been updated')
            }
        })
        .catch(err => {
            console.log(err)
            errResponse(res, err)
        })
}
