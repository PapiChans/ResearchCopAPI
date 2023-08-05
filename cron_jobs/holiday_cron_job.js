const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.holidayCronJob = () => {
    cron.schedule('0 0 * * *', () => {})
}
