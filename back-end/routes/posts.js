const express = require("express")
const posts = express.Router();
const DB = require('../utilities/dbConn.js')

//Gets all the news in the DB 
posts.post('/', async (req, res) => {
    console.log("posts")
    res.send()
})

module.exports = posts
