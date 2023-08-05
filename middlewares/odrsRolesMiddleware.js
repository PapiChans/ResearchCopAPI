exports.odrsRoles = (req, res, next) => {
    const userRoles = req.user.user_roles

    if (userRoles.includes('OIC, Student Records') || userRoles.includes('Signatory')) return next()
    else return res.status(401).send('Oops! You are unauthorized to view your request')
}
