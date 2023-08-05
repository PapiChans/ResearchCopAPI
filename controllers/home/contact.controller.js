/**
 * =====================================================================
 * * CONTACT CONTROLLER
 * =====================================================================
 * Controller for the Get in Touch section of Homepage.
 * =====================================================================
 */

// Import required packages
const { errResponse, dataResponse } = require('../../helpers/controller.helper')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

// * dotenv config
require('dotenv').config()

// * Send the Message to the Admin (MyPUPQC Support) - using testmail.app
function sendContactMessage(res, emailBody) {
    // configure Mailgun transport
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }

    let transporter = nodemailer.createTransport(mg(auth))

    // send mail with defined transport object
    transporter.sendMail(emailBody, (err, info) => {
        if (err) {
            console.log(err)
            errResponse(res, 'Message not sent.')
        } else {
            dataResponse(res, info, 'Message successfully sent.', 'Message not sent.')
        }
    })
}

// % Get in Touch
// % ROUTE: /mypupqc/v1/get-in-touch
exports.getInTouch = (req, res) => {
    const { name, email_address, subject, message } = req.body
    const from = name + ' <' + email_address + '>'
    // * In the future, mas maganda kung meron na talaga tayong email address
    // * para dito kasi ang hirap pala gamitin nung testmail.app (capitalism moments)
    const sendTo = `mypupqc@gmail.com`

    const emailBody = {
        from: from,
        to: sendTo,
        subject: subject,
        text: message,
        html: `<p>${message}</p>`,
    }

    sendContactMessage(res, emailBody)
}
