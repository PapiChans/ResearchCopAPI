const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.evrsersCronJob = () => {
    // ? Runs every day at 12:00 AM
    cron.schedule('0 0 * * *', () => {
        // * Update 'Approved' reservations to 'Done' if reserve_date is less than or equal to the current date
        db.Reservation.update(
            {
                reserve_status: 'Done',
                remarks: `As part of our monitoring and evaluation, and to improve the quality of our system and services, all Approved reservations in the Eversers Reservation System (ERS) that has been reserved and done already shall be automatically marked as Done after the day of the said reservation. Since the reservation is done, the reservation is now automatically marked as Done.`,
            },
            {
                where: {
                    reserve_status: 'Approved & Released',
                    reserve_date: {
                        [Op.lt]: Date.now(),
                    },
                },
            }
        )
            .then(result => {
                if (result[0] > 0)
                    console.log(
                        `${result[0]} Approved reservations has been marked as Done automatically`
                    )
                else console.log('No Approved reservations has been marked as Done automatically')
            })
            .catch(err => {
                console.log(err)
            })

        // * Update 'For Review' reservations to 'Cancelled by Staff' if reserve_date is less than or equal to the current date
        db.Reservation.update(
            {
                reserve_status: 'Cancelled by Staff',
                remarks: `As part of our monitoring and evaluation, and to improve the quality of our system and services, all Pending reservations in the Eversers Reservation System (ERS) that has not been reserved and done yet shall be automatically cancelled after 90 days of nonappearance. Since you did not go to the school to reserve the equipment within 90 days from the date you made the reservation, the reservation is now automatically cancelled.`,
            },
            {
                where: {
                    reserve_status: 'For Review',
                    reserve_date: {
                        [Op.lt]: Date.now(),
                    },
                },
            }
        )
            .then(result => {
                if (result[0] > 0)
                    console.log(
                        `${result[0]} Pending reservations has been cancelled automatically`
                    )
                else console.log('No Pending reservations has been cancelled automatically')
            })
            .catch(err => {
                console.log(err)
            })
    })
}
