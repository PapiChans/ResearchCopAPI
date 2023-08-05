const db = require('../../../models')
const {
    checkAuthorization,
    dataResponse,
    errResponse,
    emptyDataResponse,
} = require('../../../helpers/controller.helper')
const { BlobServiceClient } = require('@azure/storage-blob')
const { Op } = require('sequelize')
const { sequelize } = require('../../../models')


// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.displayAllResearch = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return 

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            research_status: 'Approved',
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
        limit: 7,
        order: sequelize.random(),
    })

        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.displayResearch = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    const query  = req.body.query

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            research_status: 'Approved',
            [Op.or]: [
                {research_title: { [Op.iLike]: `%${query}%` } },
                {research_author: { [Op.iLike]: `%${query}%`  } },
                {research_abstract: { [Op.iLike]: `%${query}%` } },
                {research_program: { [Op.iLike]: `%${query}%` } },
            ]
        },
        include: [
            {
                model: db.User, 
                attributes: ['user_id'],
                as: 'research_user',
            },
        ],
        limit: 20,
    })
        .then(data => {
            dataResponse(res, data, 'A Record has been identified', 'No Record has been identified')
        })
        .catch(err => errResponse(res, err))
}

// % View All Research Records available in the database.
// % ROUTE: /mypupqc/v1/super_admin/research-records/
exports.displayCapstone = (req, res, next) => {
    // Check if user logged in or logged in but not Admin
    let v = checkAuthorization(req, res, 'Student')
    if (v != null) return v

    // Query where It finds the submitted research who's currently login
    db.ResearchDetails.findAll({
        where: {
            research_status: 'Approved',
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

// % View Specific Research Records available based on the [:research_id] parameter.
// % ROUTE: /mypupqc/v1/student/my_submissions/:research_id
exports.viewSpecificResearch = (req, res, next) => {
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