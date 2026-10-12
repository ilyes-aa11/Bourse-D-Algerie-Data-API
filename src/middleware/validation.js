function validateYear(req, res, next) {
    const {year} = req.params
    const currentYear = new Date().getFullYear()
    const parsedYear = Number(year)

    if (!/^\d{4}$/.test(year) || !Number.isInteger(parsedYear) ||
        parsedYear < 1999 || parsedYear > currentYear) {
        return res.status(400).json({
            message: `Invalid year parameter must be between 1999 and ${currentYear}`
        })
    }

    req.params.year = parsedYear
    next()
}

function validateSessionID(req, res, next) {
    const {sessionID} = req.params

    if (!/^\d+$/.test(sessionID) || Number(sessionID) < 1) {
        return res.status(400).json({
            message: 'A valid sessionID must be provided'
        })
    }

    next()
}

function validateType(req, res, next) {
    const allowedTypes = ['all', 'main', 'bond', 'sme']
    const {type} = req.params

    if (!allowedTypes.includes(type)) {
        return res.status(400).json({
            message: `Invalid type parameter. It must be one of: ${allowedTypes.join(', ')}`
        })
    }

    next()
}

module.exports = {validateYear, validateSessionID, validateType}
