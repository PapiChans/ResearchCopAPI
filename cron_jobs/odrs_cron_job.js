const cron = require('node-cron')
const { Sequelize } = require('sequelize')
const db = require('../models')
const { Op } = Sequelize

exports.odrsCronJob = () => {
    // ? Runs every day at 12:00 AM
    cron.schedule('0 0 * * *', () => {
        // * Update status of request to 'Cancelled by Staff' if the request is 'For Clearance' and the expiration is less than the current date
        db.Request.update(
            {
                status_of_request: 'Cancelled by Staff',
                cancelled: Date.now(),
                payment_status: 'Cancelled',
                expiration: null,
                remarks: `As part of our monitoring and evaluation, and to improve the quality of our system and services, all requests in the Online Document Request and Tracking System (ODRTS) with no submitted requirements shall be automatically cancelled after 90 days of noncompliance. Since you did not submit the requirements needed for the documents requested nor paid for the processing fee in this request with "For Clearance" status for 90 days, the request is now automatically cancelled.`,
            },
            {
                where: {
                    status_of_request: ['For Clearance'],
                    expiration: {
                        [Op.lt]: Date.now(),
                    },
                },
            }
        )
            .then(result => {
                if (result[0] > 0)
                    console.log(
                        `${result[0]} For Clearance requests has been cancelled automatically`
                    )
                else console.log('No For Clearance requests has been cancelled automatically')
            })
            .catch(err => {
                console.log(err)
            })

        // * Update status of request to 'Cancelled by Staff' if the request is 'Ready for Pickup' and the expiration is less than the current date
        db.Request.update(
            {
                status_of_request: 'Cancelled by Staff',
                cancelled: Date.now(),
                expiration: null,
                remarks: `As part of our monitoring and evaluation, and to improve the quality of our system and services, all Ready for Pickup requests in the Online Document Request and Tracking System (ODRTS) that has not been claimed by the students shall be automatically cancelled after 90 days of nonappearance. Since you did not go to the school to claim your request within 90 days from the date you were advised to claim the documents, the request is now automatically cancelled.`,
            },
            {
                where: {
                    status_of_request: ['Ready for Pickup'],
                    expiration: {
                        [Op.lt]: Date.now(),
                    },
                },
            }
        )
            .then(result => {
                if (result[0] > 0)
                    console.log(
                        `${result[0]} Ready for Pickup requests has been cancelled automatically`
                    )
                else console.log('No Ready for Pickup requests has been cancelled automatically')
            })
            .catch(err => {
                console.log(err)
            })
    })
}
