const axios = require('axios')
const cheerio = require('cheerio')

function extractCompanyCode(companiesObj) {
    // companiesObj is returned from the function **getCompanies**
    let codes = new Set()
    for(let company of companiesObj.companies) {
        codes.add(company.Code)
    }

    return codes;
}

async function getStockPrices(marketType = "all") {
    const { data } = await axios.get('https://www.sgbv.dz/')
    const parser = cheerio.load(data)

    const stocks = {}

    parser('div.wrapper').each((i, element) => {
        let stock = parser(element)
        let stockData = stock.find('.valeur span').text().trim().split(/\s+/)
        let stockCode = stockData.shift()
        let stockValue = stockData.join(' ')
        let stockVar = stock.find('.var.fr span').text().trim()

        if (stockCode && stockValue) {
            stocks[stockCode] = {
                stockValue,
                stockVar
            }
        }
    })

    if( marketType === "all" ) {
        return stocks;
    }
    else if (marketType === "main" || marketType === "bond" || marketType === "sme") {
        const codes = extractCompanyCode(await getCompanies(marketType))
        for(let compCode of Object.keys(stocks)) {
            if(!codes.has(compCode)) {
                delete stocks[compCode]
            }
        }
    }

    return stocks;
}

async function getCompanies(marketType) {
    const companyPages = {
        main: 'ligne_societe',
        bond: 'ligne_societe_creance',
        sme: 'ligne_pme'
    }
    const page = companyPages[marketType]

    if (!page) {
        throw new Error(`Unsupported market type: ${marketType}`)
    }

    const url = `https://www.sgbv.dz/?page=${page}&lang=eng`
    const { data } = await axios.get(url)
    const parser = cheerio.load(data)

    let companies = []
    const columns = []
    const firstRow = parser('table.table tbody tr').first()
    firstRow.find('td').each((i, element) => {
        columns.push(parser(element).text().trim())
    })

    parser('table.table tbody tr').each((i,element) => {
        if(i == 0) return;

        let company = {}
        parser(element).find('td').each((index, child) => {
            company[columns[index]] = parser(child).text().trim()
        })

        companies.push(company)
    })

    return {companies}
}

async function getSessionsHistory(marketType ,year = 2026) {
    switch(marketType) {
        case 'main':
            var url = "https://www.sgbv.dz/?page=histo_boc&lang=eng";
            break;
        case 'bond':
            var url = "https://www.sgbv.dz/?page=histo_boc_creance&lang=eng"
            break;
        case 'sme':
            var url = "https://www.sgbv.dz/?page=histo_boc_pme&lang=eng";
            break;
    }

    const client = axios.create({
    timeout: 20000,
    headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "https://www.sgbv.dz",
        Referer: url,
        "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:154.0) Gecko/20100101 Firefox/154.0",
        "X-Requested-With": "XMLHttpRequest",
    },
    });

    if (marketType === "main" || marketType === "bond") {
        let type = ( marketType === "main" ) ? 1:2;
        var body = new URLSearchParams({
            date: `${year}`,
            lang: "eng",
            type,
        });
        var backendUrl = "https://www.sgbv.dz/fr/histo_boc_ajax.php";
    }
    else if(marketType === "sme") {
        var body = new URLSearchParams({
            date: `${year}`,
            lang: "eng",
        });
        var backendUrl = "https://www.sgbv.dz/fr/histo_boc_pme_ajax.php";
    }

    const { data: html } = await client.post(backendUrl, body);
    const parser = cheerio.load(html)
    const columns = []
    const sessions = []

    let firstRow = parser('table tr').first()
    firstRow.find('td').each((i, element) => {
        columns.push(parser(element).text().trim())
    })

    columns.pop() // we remove the last element which is detail column

    parser('table tr').each((i,element) => {
        if(i == 0) return;

        let session = {}
        parser(element).find('td').each((index, child) => {
            if (index >= columns.length) return;
            session[columns[index]] = parser(child).text().trim()
        })

        sessions.push(session)
    })

    return {sessions}
}

async function getSessionDetails(marketType,sessionID) {
    if (marketType === "main") {
        var url = `https://www.sgbv.dz/?page=details_boc&id_sea=${sessionID}&lang=eng`;
    }
    else if (marketType === "bond") {
        var url = `https://www.sgbv.dz/?page=details_boc_creance&id_sea=${sessionID}&lang=eng`
    }
    else if (marketType === "sme") {
        var url = `https://www.sgbv.dz/?page=details_boc_pme&id_sea=${sessionID}&lang=eng`
    }
    const { data } = await axios.get(url)
    const parser = cheerio.load(data)
    const details = []
    const columns = []
    const table = parser('table.table').first()

    table.find('tr').first().find('td').each((i, element) => {
        columns.push(parser(element).text().trim())
    })

    table.find('tr').each((i, element) => {
        if (i === 0) return

        const detail = {}
        parser(element).find('td').each((index, child) => {
            if (index >= columns.length) return
            detail[columns[index]] = parser(child).text().trim()
        })

        if (Object.keys(detail).length > 0) {
            details.push(detail)
        }
    })

    return {details}
}

module.exports = { getStockPrices, getCompanies, getSessionsHistory, getSessionDetails}