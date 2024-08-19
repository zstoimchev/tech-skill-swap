const express = require("express")
const scraper = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')

const scrapeSite = async (url, selectorClass, articleList) => {
    try {
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        $(selectorClass.item).each((index, element) => {
            if (index < 9) {
                const title = $(element).find(selectorClass.title).text()
                let link = $(element).find(selectorClass.link).attr('href')
                if (selectorClass.originName === "GSMArena")
                    link = `https://www.gsmarena.com/${$(element).find(selectorClass.link).attr('href')}`;
                const summary = $(element).find(selectorClass.summary).text()
                const image = $(element).find(selectorClass.image).attr('src')

                const articleExists = articleList.some(article => article.title === title || article.link === link)

                if (title && summary)
                    articleList.push({ title, link, summary, image, origin: selectorClass.originName })
            }
        })
    } catch (error) {
        console.error(error)
    }
}

const techRadarSelectors = {
    item: '.listingResult',
    title: 'h3',
    link: 'a',
    summary: 'p.synopsis',
    image: 'img',
    originName: 'TechRadar',
}
const tomsGuideSelectors = {
    item: '.listingResult',
    title: 'h3',
    link: 'a',
    summary: 'p.synopsis',
    image: 'img',
    originName: 'Tom\'s\ Guide'
}
const gsmArenaSelectors = {
    item: '.news-item',
    title: 'h3',
    link: 'a',
    summary: 'p',
    image: 'img',
    originName: 'GSMArena'
}


scraper.get('/', async (req, res) => {
    const articles = []

    await scrapeSite('https://www.techradar.com/news', techRadarSelectors, articles)
    await scrapeSite('https://www.techradar.com/pro/news', techRadarSelectors, articles)
    await scrapeSite('https://www.tomsguide.com/news', tomsGuideSelectors, articles)
    await scrapeSite('https://www.gsmarena.com/news.php3', gsmArenaSelectors, articles)

    return res.status(200).json({ success: true, msg: "News succesfully scraped!", news: articles })
})

module.exports = scraper