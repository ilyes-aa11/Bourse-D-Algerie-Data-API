const express = require('express')
const {getStockPrices,getCompanies,getSessionsHistory} = require('./scraper.js')
const api = express()
const port = 3000

api.get('/', (req,res) => {res.json({message: "success"})}) // testing route

api.get('/market/companies/main', async (req,res) => {
    try {
        let results = await getCompanies('https://www.sgbv.dz/?page=ligne_societe&lang=eng')
        res.status(200).json(results)
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path '/market/main/companies'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})

api.get('/market/companies/bond', async (req,res) => {
    try {
        let results = await getCompanies('https://www.sgbv.dz/?page=ligne_societe&lang=eng')
        res.status(200).json(results)
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path '/market/main/companies'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})

api.get('/market/companies/sme', async (req,res) => {
    try {
        let results = await getCompanies('https://www.sgbv.dz/?page=ligne_pme&lang=eng')
        res.status(200).json(results)
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path '/market/main/companies'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})

api.get('/sessions/main/history/:year' , async (req,res) => {
    try {
        let year = req.params.year
        const currentYear = new Date().getFullYear()
        if (year < 1999 || year > currentYear) {
            res.status(400).json({message: `Invalid year parameter must be between 1999 and ${currentYear}`})
        }
        else {
            let results = await getSessionsHistory(year)
            res.status(200).json(results)
        }
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path 'sessions/history/:year'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})

api.get('/sessions/main/:sessionID', async (req,res) => {
    try {
        let results = await getCompanies(`https://www.sgbv.dz/?page=details_boc_creance&id_sea=${req.params.sessionID}&lang=eng`)
        res.status(200).json(results)
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path 'sessions/main/:sessionID'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})

api.get('/stocks', async (req,res) => {
    try {
        let results = await getStockPrices()
        res.status(200).json(results)
    }
    catch(err) {
        console.error(" An error occured while handling a GET request on path '/stocks'",
            err
        )
        res.status(500).json({ message: 'An internal server error has occurred' })
    }
})


api.listen(port, (err) => {
    if(err) console.error("An error has occured \n", err)
    else console.log("The api is running on port", port)
})