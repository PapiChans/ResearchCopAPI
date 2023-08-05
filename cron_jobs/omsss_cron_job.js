const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.omsssCronJob = () => {
    // ? Runs every day at 12:00 AM
    cron.schedule('0 0 * * *', () => {
        // * Update 'Pending' reservations to 'Cancelled by Staff' if appointment_date is less than or equal to the current date
        db.Health_Appointment.update(
            {
                consultation_status: 'Cancelled by Staff',
                remarks: `As part of our monitoring and evaluation, and to improve the quality of our system and services, all Pending appointments in the Online Medical Services Scheduling System (OMSSS) that has not been undergone into status change or not set into done status yet shall be automatically cancelled on the day of nonappearance. Since you did not go to the school to go to the date of the appointment, the appointment is now automatically cancelled.`,
            },
            {
                where: {
                    consultation_status: {
                        [Op.or]: ['Pending', 'Approved'],
                    },
                    consultation_date: {
                        [Op.lt]: Date.now(),
                    },
                },
            }
        )
            .then(result => {
                if (result[0] > 0)
                    console.log(
                        `${result[0]} Pending/Approved appointments has been cancelled automatically`
                    )
                else
                    console.log('No Pending/Approved appointments has been cancelled automatically')
            })
            .catch(err => {
                console.log(err)
            })
    })
}
