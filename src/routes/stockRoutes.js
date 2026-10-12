const express = require('express')
const {getStockPrices} = require('../scraper.js')
const asyncHandler = require('../middleware/asyncHandler.js')
const {validateType} = require('../middleware/validation.js')

const router = express.Router()

router.get('/:type', validateType, asyncHandler(async (req, res) => {
    const results = await getStockPrices(req.params.type)
    res.status(200).json(results)
}))

module.exports = router
