function errorHandler(err, req, res, next) {
    console.error(`An error occurred while handling ${req.method} ${req.originalUrl}`, err)
    res.status(500).json({message: 'An internal server error has occurred'})
}

module.exports = errorHandler
