const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')

// % -> View All Signatory PUP Staff users
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_signatory_users
exports.viewSignatoryUsers = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Role.findOne({ where: { role_name: 'Signatory' } }).then(data => {
        db.UserRole.findAll({
            where: { role_id: data.role_id },
            include: [
                {
                    model: db.User,
                    as: 'user_assigned_to_role',
                    include: ['user_profiles', 'education_profile'],
                },
            ],
        })
            .then(data => {
                dataResponse(
                    res,
                    data,
                    'Signatory Users have been retrieved',
                    'No Signatory Users have been retrieved'
                )
            })
            .catch(err => errResponse(res, err))
    })
}

// % -> View All Signatories
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_all_signatories
exports.viewAllSignatories = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findAll({
        where: { status_of_request: 'For Evaluation/Processing' },
        include: [
            {
                separate: true,
                model: db.Request_Signatory,
                as: 'signatories_assigned_to_request',
                where: { user_id: req.user.user_id, is_signed: false, is_onhold: false },
                include: ['signatory_for_document'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            data = data.filter(d => d.signatories_assigned_to_request.length > 0)
            dataResponse(
                res,
                data,
                'Signatories have been retrieved',
                'No Signatories have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Approved Signatories
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_all_approved_signatories
exports.viewAllApprovedSignatories = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findAll({
        where: { status_of_request: ['For Evaluation/Processing', 'Ready for Pickup', 'Released'] },
        include: [
            {
                separate: true,
                model: db.Request_Signatory,
                as: 'signatories_assigned_to_request',
                where: { user_id: req.user.user_id, is_signed: true, is_onhold: false },
                include: ['signatory_for_document'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            data = data.filter(d => d.signatories_assigned_to_request.length > 0)
            dataResponse(
                res,
                data,
                'Signatories have been retrieved',
                'No Signatories have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View All Onhold Signatories
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_all_onhold_signatories
exports.viewAllOnholdSignatories = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findAll({
        where: { status_of_request: 'For Evaluation/Processing' },
        include: [
            {
                separate: true,
                model: db.Request_Signatory,
                as: 'signatories_assigned_to_request',
                where: { user_id: req.user.user_id, is_signed: false, is_onhold: true },
                include: ['signatory_for_document'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
        ],
    })
        .then(data => {
            data = data.filter(d => d.signatories_assigned_to_request.length > 0)
            dataResponse(
                res,
                data,
                'Signatories have been retrieved',
                'No Signatories have been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Specific Signatory
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_signatory/:request_id
exports.viewSpecificSignatory = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request.findOne({
        where: { request_id: req.params.request_id },
        include: [
            {
                separate: true,
                model: db.Document_Request,
                as: 'documents_assigned_to_request',
                include: ['document_information'],
            },
            {
                model: db.User,
                as: 'user_assigned_to_request',
                include: ['user_profiles', 'education_profile'],
            },
            {
                separate: true,
                model: db.Request_Signatory,
                as: 'signatories_assigned_to_request',
                include: [
                    'signatory_for_document',
                    {
                        model: db.User,
                        as: 'signatory_for_user',
                        include: ['user_profiles'],
                    },
                ],
                order: [
                    ['document_id', 'ASC'],
                    ['hierarchy_number', 'ASC'],
                ],
            },
        ],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Signatory has been retrieved',
                'No Signatory has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % -> View Specific Request Signatory
// % ROUTE: /mypupqc/v1/odrs/pup_staff/view_request_signatory/:request_id/:document_id
exports.viewSpecificRequestSignatory = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request_Signatory.findAll({
        where: {
            request_id: req.params.request_id,
            document_id: req.params.document_id,
        },
        include: [
            'signatory_for_document',
            {
                model: db.User,
                as: 'signatory_for_user',
                include: ['user_profiles'],
            },
        ],
        order: [['hierarchy_number', 'ASC']],
    })
        .then(data => {
            dataResponse(
                res,
                data,
                'Signatory has been retrieved',
                'No Signatory has been retrieved'
            )
        })
        .catch(err => errResponse(res, err))
}

// % Approve Signatory
// % ROUTE: /mypupqc/v1/odrs/pup_staff/approve_signatory/:request_id/:document_id
exports.approveSignatory = async (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    const isPreviousSigned = await db.Request_Signatory.findAll({
        where: {
            request_id: req.params.request_id,
            document_id: req.params.document_id,
        },
    }).then(data => {
        let previousSignatory = null
        let currentSignatory
        data.forEach(signatory => {
            if (req.user.user_id == signatory.user_id) {
                currentSignatory = signatory
            }
        })
        if (currentSignatory === undefined) {
            return '0'
        } else {
            data.forEach(signatory => {
                let currentSignatoryNumber = currentSignatory.hierarchy_number - 1
                if (currentSignatoryNumber == signatory.hierarchy_number) {
                    previousSignatory = signatory
                }
            })
        }

        console.log('previous signatory: ', previousSignatory)
        console.log('current signatory: ', currentSignatory)
        if (previousSignatory == null) {
            console.log('siya si first hierarchy')
            return null
        }
        if (previousSignatory.is_signed == true) {
            console.log('pirmahan mo si current signatory')
            return true
        } else {
            // ! error
            console.log('hindi pa napirmahan si previous signatory')
            return false
        }
    })

    const isLastSignatory = await db.Request_Signatory.findAll({
        where: {
            request_id: req.params.request_id,
        },
    }).then(data => {
        let lastSignatory = null
        let currentSignatory
        data.forEach(signatory => {
            if (req.user.user_id == signatory.user_id) {
                currentSignatory = signatory
            }
        })

        if (currentSignatory === undefined) {
            return '0'
        } else {
            data.forEach(signatory => {
                let currentSignatoryNumber = currentSignatory.hierarchy_number + 1
                if (currentSignatoryNumber == signatory.hierarchy_number) {
                    lastSignatory = signatory
                }
            })
        }

        if (lastSignatory == null) {
            console.log('siya si last signatory')
            return true
        } else {
            console.log('hindi pa siya si last signatory')
            return false
        }
    })

    if (isPreviousSigned === false) {
        return errResponse(res, 'Previous Signatory is not yet signed')
    } else if (isPreviousSigned === '0') {
        return errResponse(res, 'YOu are not a signatory for this document')
    }
    if (isPreviousSigned == null || isPreviousSigned == true) {
        db.Request_Signatory.update(
            {
                is_signed: true,
                remarks: req.body.remarks,
            },
            {
                where: {
                    request_id: req.params.request_id,
                    document_id: req.params.document_id,
                    user_id: req.user.user_id,
                },
            }
        )
            .then(data => {
                if (data[0] == 0) return errResponse(res, 'Signatory has not been approved')

                const updateData = {
                    approved: new Date(),
                }

                if (isLastSignatory) updateData.is_approved_all = true

                db.Request.update(updateData, {
                    where: {
                        request_id: req.params.request_id,
                    },
                })
                    .then(result => {
                        if (result[0] == 0) return errResponse(res, 'Request has not been approved')

                        dataResponse(
                            res,
                            data,
                            'Signatory has been approved',
                            'Signatory has not been approved'
                        )
                    })
                    .catch(err => errResponse(res, err))
            })
            .catch(err => errResponse(res, err))
    }
}

// % Onhold Signatory
// % ROUTE: /mypupqc/v1/odrs/pup_staff/onhold_signatory/:request_signatory_id
exports.onholdSignatory = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request_Signatory.update(
        {
            is_onhold: true,
            remarks: req.body.remarks,
        },
        {
            where: {
                request_signatory_id: req.params.request_signatory_id,
            },
        }
    )
        .then(data => {
            if (data[0] == 0) return errResponse(res, 'Signatory has not been onhold')

            db.Request_Signatory.findByPk(req.params.request_signatory_id)
                .then(result => {
                    db.Request.update(
                        {
                            onhold: new Date(),
                        },
                        {
                            where: {
                                request_id: result.request_id,
                            },
                        }
                    )
                        .then(finalResult => {
                            if (finalResult[0] == 0)
                                return errResponse(res, 'Request has not been onhold')

                            dataResponse(
                                res,
                                finalResult,
                                'Signatory has been onhold',
                                'Signatory has not been onhold'
                            )
                        })
                        .catch(err => errResponse(res, err))
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}

// % Revert Onhold Signatory
// % ROUTE: /mypupqc/v1/odrs/pup_staff/revert_onhold/:request_signatory_id
exports.revertOnhold = (req, res) => {
    let v = checkAuthorization(req, res, 'PUP Staff')
    if (v != null) return v

    db.Request_Signatory.update(
        {
            is_onhold: false,
            remarks: null,
        },
        {
            where: {
                request_signatory_id: req.params.request_signatory_id,
            },
        }
    )
        .then(data => {
            if (data[0] == 0) return errResponse(res, 'Signatory has not been reverted')

            db.Request_Signatory.findByPk(req.params.request_signatory_id)
                .then(result => {
                    dataResponse(
                        res,
                        result,
                        'Signatory has been reverted',
                        'Signatory has not been reverted'
                    )
                })
                .catch(err => errResponse(res, err))
        })
        .catch(err => errResponse(res, err))
}
