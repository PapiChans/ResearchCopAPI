/**
 * =====================================================================
 * * RESET PASSWORD CONTROLLER
 * =====================================================================
 * Controllers for Reset Password related
 * * Thanks sa guide na ito:
 * * https://www.youtube.com/watch?v=72JYhSoVYPc
 * =====================================================================
 */
// Import required packages
const db = require('../../models')
const { errResponse, dataResponse } = require('../../helpers/controller.helper')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

// * dotenv config
require('dotenv').config()

// * Send Reset Password Link to Email Address provided by User
function sendResetPasswordEmail(res, email, link) {
    // configure Mailgun transport
    let auth = {
        auth: {
            api_key: process.env.MAILGUN_API,
            domain: process.env.MAILGUN_DOMAIN,
        },
    }

    let transporter = nodemailer.createTransport(mg(auth))

    // send mail with defined transport object
    transporter.sendMail(
        {
            from: '"MyPUPQC Support" <support@mypupqc.live>',
            to: 'mypupqc@gmail.com',
            subject: 'Reset your MyPUPQC password',
            text: `Click this link to reset your MyPUPQC password: ${link}`,
            html: `<p>Click <a href="${link}">this link</a> to reset your MyPUPQC password. The link only expires in 5 minutes.</p>`, // html body
        },
        (err, info) => {
            if (err) {
                console.log(`Error: ${err}`)
                errResponse(res, 'Reset password email not sent.')
            } else {
                dataResponse(
                    res,
                    info,
                    'Reset password email successfully sent.',
                    'Reset password email not sent.'
                )
            }
        }
    )
}

// % Verify Reset Password Token
// % ROUTE: /mypupqc/v1/verify-reset-password/:token
exports.verifyResetPassword = (req, res) => {
    const token = req.params.token

    // Check if token is valid
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(200).send({
                error: true,
                message: 'Invalid or expired token',
            })
        } else {
            return res.status(200).send({
                error: false,
                message: 'Valid token',
            })
        }
    })
}

// Generate token
const generateToken = data => {
    return jwt.sign(data, process.env.SECRET_TOKEN, { expiresIn: '5m' })
}

// Encrypt the password using bcrypt
const encryptPassword = password => {
    return bcrypt.hashSync(password, 10)
}

// % Reset Password link provider to be sent on email
// % ROUTE: /mypupqc/v1/reset-password-request
exports.resetPasswordLink = (req, res) => {
    const email_address = req.body.email_address

    // Check if email field is empty
    if (String(email_address) === '') {
        return res.status(500).send({
            error: true,
            message: 'Email Address cannot be empty',
        })
    }

    // * Titingin siya dapat sa database kung may email address na yun
    // >> Pero, dahil yung code natin sa mga students at PUP Staff ay
    // >> magkaiba, kailangan yung email_address field ng PUP Staff ay pareho
    // >> na dun sa ginagamit nila sa PUP Staff Portal
    db.UserProfile.findOne({
        where: { email_address: email_address },
    })
        .then(data => {
            if (data == null) errResponse(res, 'That email address does not exist.')
            else {
                // * Generate token
                const token = generateToken({
                    user_id: data.user_id,
                    email_address: email_address,
                })

                const link = `https://www.mypupqc.live/reset-password/${token}`

                // Send reset password email
                sendResetPasswordEmail(res, email_address, link)
            }
        })
        .catch(err => errResponse(res, err))
}

// % Reset Password
// % ROUTE: /mypupqc/v1/reset-password
exports.resetPassword = (req, res) => {
    const { token, password } = req.body

    // Check if token is empty
    if (String(token) === '' || String(password) === '') {
        return res.status(500).send({
            error: true,
            message: 'Token or Password cannot be empty',
        })
    }

    // * Verify token
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(500).send({
                error: true,
                message: 'Token is invalid',
            })
        }

        // * Check if user exists using user_id from jwt (decoded.user_id)
        db.User.findOne({
            where: { user_id: decoded.user_id },
        })
            .then(data => {
                if (data == null) errResponse(res, 'User does not exist.')
                else {
                    // * Update password
                    db.User.update(
                        { password: encryptPassword(password) },
                        { where: { user_id: decoded.user_id } }
                    )
                        .then(data => {
                            dataResponse(
                                res,
                                data,
                                'Password successfully updated.',
                                'Password not updated'
                            )
                        })
                        .catch(err => errResponse(res, err))
                }
            })
            .catch(err => errResponse(res, err))
    })
}
