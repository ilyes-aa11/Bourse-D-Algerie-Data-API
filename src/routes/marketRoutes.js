const express = require('express')
const {getCompanies} = require('../scraper.js')
const asyncHandler = require('../middleware/asyncHandler.js')

const router = express.Router()

for (const market of ['main', 'bond', 'sme']) {
    router.get(`/companies/${market}`, asyncHandler(async (req, res) => {
        const results = await getCompanies(market)
        res.status(200).json(results)
    }))
}

module.exports = router
