const express = require("express")
const posts = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const util = require('util')
const jwtVerify = util.promisify(jwt.verify)
const UTILS = require('../utils/functions.js')

posts.get('/', async (req, res, next) => {
    try {
        const queryResult = await DB.allPosts()
        return res.status(200).json({ arr: queryResult, success: true, msg: "All posts fetches." })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: "Sometging happened!" })
        // next()
    }
})

posts.get('/:id', async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        console.log("No token")
        return res.status(401).json({ success: false, msg: "No JWT token found. Please login first." })
    }

    try {
        const user = await jwtVerify(token, process.env.JWT_TOKEN_SECRET);
        req.user = user;
    } catch (err) {
        console.log("Invalid token")
        return res.status(403).json({ success: false, msg: "JWT token expired! Please log in again." })
    }

    if (!(UTILS.verifyId(req.params.id))) {
        return res.status(200).json({ success: false, msg: "Bad ID! Try again." })
    }

    try {
        const queryResult = await DB.onePost(req.params.id)
        return res.status(200).json({ arr: queryResult[0], success: true, msg: "Post succesfully fetched." })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: "omething happened. Internal server error" })
        // next()
    }
})

module.exports = posts
