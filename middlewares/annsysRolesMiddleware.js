exports.annsysReporterRole = (req, res, next) => {
    const userRoles = req.user.user_roles

    if (userRoles.includes('News Reporter')) return next()
    else return res.status(401).send('Oops! You are unauthorized to view your request')
}

exports.annsysPublicRelationsRole = (req, res, next) => {
    const userRoles = req.user.user_roles

    if (userRoles.includes('Public Relations')) return next()
    else return res.status(401).send('Oops! You are unauthorized to view your request')
}
