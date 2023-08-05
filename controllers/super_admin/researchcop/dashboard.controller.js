const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { Op } = require('sequelize')
const moment = require('moment')


// % Gets the number of research registered in the admin by their researh statuses.
exports.getResearchCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'research_status',
        group: ['research_status'],
    })
        .then(result => {
            ResearchCount = {
                researchUpload: 0,
                researchApproved: 0,
                researchRejected: 0,
                researchPending: 0,
                copyrightReview: 0,
                copyrightApproved: 0,
            }

            result.forEach(element => {
                var count = element.count
                ResearchCount.researchUpload += count

                // Get count per research
                if (element.research_status === 'Approved') ResearchCount.researchApproved = count
                if (element.research_status === 'Rejected') ResearchCount.researchRejected = count
                if (element.research_status === 'Pending') ResearchCount.researchPending = count

            })

            data = {
                research_count: ResearchCount,
            }

            // Send userCount object
            dataResponse(res, data, 'Research Count found', 'Research Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of research registered in the admin by their researh statuses.
exports.getCategoryCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'research_category',
        group: ['research_category'],
    })
        .then(result => {
            CategoryCount = {
                categoryResearch: 0,
                categoryCapstone: 0,

            }

            result.forEach(element => {
                var count = element.count

                // Get count per research
                if (element.research_category === 'Research') CategoryCount.categoryResearch= count
                if (element.research_category === 'Capstone') CategoryCount.categoryCapstone = count

            })

            data = {
                category_count: CategoryCount,
            }

            // Send userCount object
            dataResponse(res, data, 'Research Count found', 'Research Count found')
        })
        .catch(err => errResponse(res, err))
}

// % Gets the number of research registered in the admin by their researh statuses.
exports.getCopyrightCount = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'copyright_status',
        group: ['copyright_status'],
    })
        .then(result => {
            CopyrightCount = {
                copyrightReview: 0,
                copyrightApproved: 0,
            }

            result.forEach(element => {
                var count = element.count

                // Get count per research
                if (element.copyright_status === 'Reviewing') CopyrightCount.copyrightReview = count
                if (element.copyright_status === 'Approved') CopyrightCount.copyrightApproved = count
            })

            data = {
                copyright_count: CopyrightCount,
            }

            // Send userCount object
            dataResponse(res, data, 'Copyright Count found', 'Copyright Count found')
        })
        .catch(err => errResponse(res, err))
}

exports.getProgramCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'research_program',
        group: ['research_program'],
    })
        .then(result => {
            programCount = {}
            result.forEach(element => {
                programCount[element.research_program] = element.count
            })
            data = {
                program_count: programCount,
            }
            dataResponse(res, data, 'Program Count found', 'No Program Count found')
        })
        .catch(err => errResponse(res, err))
}

exports.getResearchCapstoneCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'research_category',
        group: ['research_category'],
    })
        .then(result => {
            CategoryCount = {}
            result.forEach(element => {
                CategoryCount[element.research_category] = element.count
            })
            data = {
                category_count: CategoryCount,
            }
            dataResponse(res, data, 'Category Count found', 'No Category Count found')
        })
        .catch(err => errResponse(res, err))
}

exports.getResearchStatusCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'research_status',
        group: ['research_status'],
    })
        .then(result => {
            ResearchStatusCount = {}
            result.forEach(element => {
                ResearchStatusCount[element.research_status] = element.count
            })
            data = {
                researchstatus_count:  ResearchStatusCount,
            }
            dataResponse(res, data, 'Research Status Count found', 'No Research Status Count found')
        })
        .catch(err => errResponse(res, err))
}

exports.getCopyrightStatusCount = async (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Super Admin')
    if (v != null) return v

    db.ResearchDetails.count({
        col: 'copyright_status',
        group: ['copyright_status'],
    })
        .then(result => {
            CopyrightStatusCount = {}
            result.forEach(element => {
                CopyrightStatusCount[element.copyright_status] = element.count
            })
            data = {
                copyrightstatus_count: CopyrightStatusCount,
            }
            dataResponse(res, data, 'Category Count found', 'No Category Count found')
        })
        .catch(err => errResponse(res, err))
}

