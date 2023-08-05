/**
 * ================================================================
 * * DATABASE CONFIGURATIONS
 * ================================================================
 */

const successMessage = () => {
    return `
=========================================================================
SUCCESSFULLY CONNECTED TO THE DATABASE!
-------------------------------------------------------------------------
It's in development phase, I'm working on it.
capstone edition.
=========================================================================
`
}

const failedMessage = err => {
    return `
=========================================================================
FAILED TO CONNECT TO THE DATABASE!
-------------------------------------------------------------------------
${err}
=========================================================================
Have you already done the following?
- Check the database credentials in ./src/config/config.js.
- Check connection in Datagrip.
- Have you created the database? You can check it on the Datagrip.
If you can't solve this, please contact the developer who is probably crying screaming shaking rn.
`
}

const syncSuccessMessage = (PORT, MAIN_API_ROUTE, env_value) => {
    return `
=========================================================================
Execution is successful!
-------------------------------------------------------------------------
Base URL: http://localhost:${PORT}${MAIN_API_ROUTE}
${
    env_value === 'false'
        ? 'Please change the value of SEQUELIZE_ALTER_SYNC to true in the ./src/config/config.js file.'
        : 'Models have been synced to the database!'
}
=========================================================================
`
}

const syncFailedMessage = err => {
    return err
}

module.exports = {
    successMessage,
    failedMessage,
    syncSuccessMessage,
    syncFailedMessage,
}
