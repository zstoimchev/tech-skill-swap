const express = require("express")
const scraper = express.Router()
const axios = require('axios');
const cheerio = require('cheerio');

scraper.get('/scrape-techradar', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.techradar.com/news');
        const $ = cheerio.load(data);
        const articles = [];

        $('.listingResult').each((index, element) => {
            if (index < 10) {
                const title = $(element).find('h3').text();
                const link = $(element).find('a').attr('href');
                const summary = $(element).find('p').text();

                articles.push({ title, link, summary });
            }
        });
        console.log("suc")
        res.json({arr: articles});
    } catch (error) {
        console.error(error);
        res.status(500).send('Error occurred while scraping');
    }
})

module.exports = scraper