const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.verificationCronJob = () => {
    // ? Runs every minute
    cron.schedule('*/30 * * * *', async () => {
        // * Find expired verification codes and delete them
        const currentTime = new Date()

        const expiredCodes = await db.Verification.findAll({
            where: {
                expiration_date: {
                    [Op.lte]: currentTime,
                },
            },
        })

        const deletePromises = expiredCodes.map(code => code.destroy())

        await Promise.all(deletePromises)
    })
}
