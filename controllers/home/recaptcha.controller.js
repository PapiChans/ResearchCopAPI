/**
 * =====================================================================
 * ? RECAPTCHA CONTROLLER
 * =====================================================================
 */
exports.verifyRecaptcha = async function (req, res) {
    try {
        // * Get response from client
        const { recaptchaToken } = req.body

        // * Verify token
        const verifyRecaptcha = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
        )

        // * Get response from Google
        const recaptchaResponse = await verifyRecaptcha.json()
        console.log(recaptchaResponse)

        // * Check if response is success
        if (!recaptchaResponse.success) {
            return res.status(400).json({ success: false, message: 'Invalid Recaptcha Token' })
        }

        // * Return response
        return res.status(200).json({ success: true, message: 'Recaptcha Token is valid' })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: 'Internal Server Error' })
    }
}
