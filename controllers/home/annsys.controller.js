/**
 * =====================================================================
 * * ANNSYS CONTROLLER (ANNOUNCEMENT SYSTEM)
 * =====================================================================
 * Controller for all related Announcements System: for News & Advisory.
 * =====================================================================
 */

// Import required packages
const { errResponse, dataResponse } = require('../../helpers/controller.helper')
const db = require('../../models')
const { Op } = require('sequelize')

// % Get the lastest 10 news on the database
// % ROUTE: /mypupqc/v1/news
exports.getTenNews = (req, res) => {
    db.Announcement.findAll({
        where: {
            announcement_type: 'News',
            announcement_status: {
                [Op.not]: ['Deleted', 'Hidden'],
            },
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
        limit: 10,
        order: [['created_at', 'DESC']],
    })
        .then(data => dataResponse(res, data, 'News fetched successfully!', 'News not fetched.'))
        .catch(err => errResponse(res, err))
}

// % Get the specific news on the database using reference_id
// % ROUTE: /mypupqc/v1/news/:reference_id
exports.getSpecificNews = (req, res) => {
    db.Announcement.findOne({
        where: {
            reference_id: req.params.reference_id,
            announcement_type: 'News',
            announcement_status: {
                [Op.not]: ['Hidden', 'Deleted'],
            },
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(data => dataResponse(res, data, 'News fetched successfully!', 'News not fetched.'))
        .catch(err => errResponse(res, err))
}

// % Get the lastest 10 advisory on the database
// % ROUTE: /mypupqc/v1/advisory
exports.getTenAdvisory = (req, res) => {
    db.Announcement.findAll({
        where: {
            announcement_type: 'Advisory',
            announcement_status: {
                [Op.not]: ['Deleted', 'Hidden'],
            },
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
        limit: 10,
        order: [['created_at', 'DESC']],
    })
        .then(data =>
            dataResponse(res, data, 'Advisory fetched successfully!', 'Advisory not fetched.')
        )
        .catch(err => errResponse(res, err))
}

// % Get the specific advisory on the database using reference_id
// % ROUTE: /mypupqc/v1/advisory/:reference_id
exports.getSpecificAdvisory = (req, res) => {
    db.Announcement.findOne({
        where: {
            reference_id: req.params.reference_id,
            announcement_type: 'Advisory',
            announcement_status: {
                [Op.not]: ['Hidden', 'Deleted'],
            },
        },
        include: [
            {
                model: db.User,
                attributes: ['user_id', 'user_no', 'user_type'],
                as: 'announcement_assigned_to_user',
                include: [
                    {
                        model: db.UserProfile,
                        as: 'user_profiles',
                        attributes: ['full_name'],
                    },
                ],
            },
        ],
    })
        .then(data =>
            dataResponse(res, data, 'Advisory fetched successfully!', 'Advisory not fetched.')
        )
        .catch(err => errResponse(res, err))
}
