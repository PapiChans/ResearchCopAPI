/**
 * ================================================================
 * * EBASA API - INDEX.JS CONFIGURATIONS
 * ================================================================
 */

// % Import Important Modules
const express = require('express')
const dotenv = require('dotenv')
const {
    successMessage,
    failedMessage,
    syncSuccessMessage,
    syncFailedMessage,
} = require('./db_message')
const jwt = require('jsonwebtoken')
const { xssMiddlewares } = require('./middlewares/xssMiddlewares')
const cors = require('cors')
const bodyParser = require('body-parser')
const { userLogger } = require('./helpers/logger')

// % Reference Models
const db = require('./models')

// % Initialize Express
var app = express()

// % Express Shenanigans
// ? parse requests of content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// ? parse requrests of content-type application/json
app.use(express.json())

// % .env config
dotenv.config()

// % PORT value
const PORT = process.env.PORT || 3600

// % Middleware
app.use(cors())
app.use(xssMiddlewares)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    const { method, socket, url, hostname } = req
    const { remoteAddress, remoteFamily } = socket

    // ? you can check session here.
    userLogger.info(
        JSON.stringify(
            {
                method,
                remoteAddress,
                remoteFamily,
                hostname,
                url,
            },
            null,
            2
        )
    )

    next()
})

/**
 * ================================================================
 * * AUTHENTICATION-RELATED
 * ================================================================
 */

// >> Generate Secret Token (one time thing lang bestie, pang-generate lang)
// secret_token = require('crypto').randomBytes(64).toString("hex");
// console.log(secret_token);
// sanaol secret

// Authenticate token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    // If token is null -> unauthorized response
    if (token == null) return res.status(401).send('No access token is detected.')
    // Verify the token, if not verified then forbidden
    jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
        // If token is not verified -> send forbidden response
        if (err) {
            if (process.env.ENABLE_ACCESS_TOKEN_LOG === 'true') userLogger.error(`${err}\n`)
            return res.sendStatus(403)
        }
        // Save token data to req.user
        req.user = user
        if (process.env.ENABLE_ACCESS_TOKEN_LOG === 'true') userLogger.info('Access Granted\n')
        next()
    })
}

/**
 * ================================================================
 * * ROUTES
 * ================================================================
 */

// % Main API Route for EBASA API
const MAIN_API_ROUTE = '/mypupqc/v1/'

// % Home Route
app.use(`${MAIN_API_ROUTE}`, require('./routes/home.route'))

// % With Authentication
app.use(`${MAIN_API_ROUTE}super_admin`, authenticateToken, require('./routes/super_admin.route'))
app.use(`${MAIN_API_ROUTE}student`, authenticateToken, require('./routes/student.route'))
app.use(`${MAIN_API_ROUTE}pup_staff`, authenticateToken, require('./routes/staff.route'))
app.use(`${MAIN_API_ROUTE}omsss`, authenticateToken, require('./routes/omsss.route'))
app.use(`${MAIN_API_ROUTE}evrsers`, authenticateToken, require('./routes/evrsers.route'))
app.use(`${MAIN_API_ROUTE}odrs`, authenticateToken, require('./routes/odrs.route'))
app.use(`${MAIN_API_ROUTE}annsys`, authenticateToken, require('./routes/annsys.route'))
app.use(`${MAIN_API_ROUTE}researchcop`, authenticateToken, require('./routes/researchcop.route'))
app.use(`${MAIN_API_ROUTE}orgms`, authenticateToken, require('./routes/orgms.route'))
app.use(`${MAIN_API_ROUTE}frs`, authenticateToken, require('./routes/frs.route'))
app.use(`${MAIN_API_ROUTE}ems`, authenticateToken, require('./routes/ems.route'))

/**
 * ================================================================
 * * DATABASE
 * ================================================================
 */

db.sequelize
    .authenticate()
    .then(() => {
        // * Log the success db connection message

        if (process.env.ENABLE_DB_LOG === 'true') {
            userLogger.info(successMessage())
        }

        // * Sync models to the database
        db.sequelize
            .sync({ alter: process.env.SEQUELIZE_ALTER_SYNC === 'true' || false })
            .then(() =>
                app.listen(PORT, () =>
                    userLogger.info(
                        `${syncSuccessMessage(
                            PORT,
                            MAIN_API_ROUTE,
                            process.env.SEQUELIZE_ALTER_SYNC
                        )}`
                    )
                )
            )
            .catch(err => userLogger.error(`${syncFailedMessage(err)}\n`))
    })
    .catch(err => {
        userLogger.error(`${failedMessage(err)}\n`)
    })

/**
 * ================================================================
 * * CRON Jobs
 * ================================================================
 */

// % Import Cron Jobs
const { odrsCronJob } = require('./cron_jobs/odrs_cron_job')
const { omsssCronJob } = require('./cron_jobs/omsss_cron_job')
const { evrsersCronJob } = require('./cron_jobs/evrsers_cron_job')
const { holidayCronJob } = require('./cron_jobs/holiday_cron_job')
const { lockoutCronJob } = require('./cron_jobs/lockout_cron_job')
const { verificationCronJob } = require('./cron_jobs/verification_cron_job')
odrsCronJob()
omsssCronJob()
evrsersCronJob()
holidayCronJob()
lockoutCronJob()
verificationCronJob()
