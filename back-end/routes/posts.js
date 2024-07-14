const express = require("express")
const posts = express.Router();
const DB = require('../DB/dbConn.js')


posts.get('/', async (req, res, next) => {
    if (!(req.session.loggedIn)) {
        return res.status(401).json({ success: false, msg: "Need to log in!" })
    }
    try {
        const queryResult = await DB.allPosts()
        return res.status(200).json(queryResult, { success: true, msg: "All posts fetches." })
        res.json(queryResult)
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: "Sometging happened!" })
        res.sendStatus(500)
        next()
    }
})

posts.get('/:id', async (req, res, next) => {
    try {
        const queryResult = await DB.onePost(req.params.id)
        res.json(queryResult)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
        next()
    }
})


module.exports = posts
