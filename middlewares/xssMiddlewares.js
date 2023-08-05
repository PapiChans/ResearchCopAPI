const xss = require('xss')

function xssMiddlewares(req, res, next) {
    // Check if the request body contains any potential XSS code
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        const sanitizedBody = sanitizeRequest(req.body)
        req.body = sanitizedBody
    }

    next()
}

function sanitizeRequest(data) {
    if (Array.isArray(data)) {
        return data.map(item => sanitizeRequest(item))
    } else if (typeof data === 'object' && data !== null) {
        const sanitizedData = {}
        for (const [key, value] of Object.entries(data)) {
            sanitizedData[key] = sanitizeRequest(value)
        }
        return sanitizedData
    } else if (typeof data === 'string') {
        return xss(data)
    } else {
        return data
    }
}

exports.xssMiddlewares = xssMiddlewares
