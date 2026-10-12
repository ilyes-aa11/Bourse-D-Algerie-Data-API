const express = require('express')
const path = require('path')
const marketRoutes = require('./routes/marketRoutes.js')
const sessionRoutes = require('./routes/sessionRoutes.js')
const stockRoutes = require('./routes/stockRoutes.js')
const errorHandler = require('./middleware/errorHandler.js')

const api = express()
const port = 3000

const documentationPage = (req, res) => {
    res.sendFile(path.join(__dirname, 'docs.html'))
}

api.get('/', documentationPage)
api.get('/docs', documentationPage)

api.use('/market', marketRoutes)
api.use('/sessions', sessionRoutes)
api.use('/stocks', stockRoutes)

api.use(errorHandler)

if (require.main === module) {
    api.listen(port, (err) => {
        if (err) {
            console.error('An error has occurred', err)
        } else {
            console.log('The api is running on port', port)
        }
    })
}

module.exports = api
