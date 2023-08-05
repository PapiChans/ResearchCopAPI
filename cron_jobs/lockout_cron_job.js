const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.lockoutCronJob = () => {
    // ? Runs every minute
    cron.schedule('* * * * *', async () => {
        try {
            const currentTime = new Date()

            // Find users who are blacklisted and have lockout expiration in the past
            const blacklistedUsers = await db.User.findAll({
                where: {
                    is_blacklist: true,
                    lockout_expiration: { [db.Sequelize.Op.lt]: currentTime },
                },
            })

            // Reset blacklisted users' lockout status and login attempts
            const resetPromises = blacklistedUsers.map(user =>
                user.update({ is_blacklist: false, login_attempt: 0, lockout_expiration: null })
            )

            await Promise.all(resetPromises)
        } catch (error) {
            console.error('Lockout expiration cron job encountered an error:', error)
        }
    })
}
