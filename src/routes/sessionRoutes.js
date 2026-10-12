const express = require('express')
const {getSessionsHistory, getSessionDetails} = require('../scraper.js')
const asyncHandler = require('../middleware/asyncHandler.js')
const {validateYear, validateSessionID} = require('../middleware/validation.js')

const router = express.Router()
const marketTypes = ['main', 'bond', 'sme']

for (const market of marketTypes) {
    router.get(`/${market}/history/:year`, validateYear, asyncHandler(async (req, res) => {
        const results = await getSessionsHistory(market, req.params.year)
        res.status(200).json(results)
    }))

    router.get(`/${market}/details/:sessionID`, validateSessionID, asyncHandler(async (req, res) => {
        const results = await getSessionDetails(market, req.params.sessionID)
        res.status(200).json(results)
    }))
}

module.exports = router
