const axios = require('axios')
const cheerio = require('cheerio')

async function getStockPrices() {
    const { data } = await axios.get('https://www.sgbv.dz/')
    const parser = cheerio.load(data)

    const stocks = {}

    parser('div.wrapper.fl').each((i, element) => {
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

    return stocks
}

async function getCompanies(url) {
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

async function getSessionsHistory(year = 2026, type = "1") {
    const client = axios.create({
    timeout: 20000,
    headers: {
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
        Origin: "https://www.sgbv.dz",
        Referer: "https://www.sgbv.dz/?page=histo_boc&lang=eng",
        "User-Agent":
        "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:154.0) Gecko/20100101 Firefox/154.0",
        "X-Requested-With": "XMLHttpRequest",
    },
    });

    const body = new URLSearchParams({
        date: `${year} `,
        lang: "eng",
        type,
    });

    const { data: html } = await client.post("https://www.sgbv.dz/fr/histo_boc_ajax.php", body);
    const parser = cheerio.load(html)
    const columns = []
    const sessions = []

    let firstRow = parser('table tr').first()
    firstRow.find('td').each((i, element) => {
        columns.push(parser(element).text().trim())
    })

    parser('table tr').each((i,element) => {
        if(i == 0) return;

        let session = {}
        parser(element).find('td').each((index, child) => {
            session[columns[index]] = parser(child).text().trim()
        })

        sessions.push(session)
    })

    return {sessions}
}

module.exports = { getStockPrices, getCompanies, getSessionsHistory}