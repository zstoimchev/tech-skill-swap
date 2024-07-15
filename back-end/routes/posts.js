const express = require("express")
const posts = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const util = require('util')
const jwtVerify = util.promisify(jwt.verify)
const UTILS = require('../utils/functions.js')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        // cb(null, Date.now() + path.extname(file.originalname)) // Appends the file extension
        callBack(null, Date.now() + `${file.originalname}`)
    }
})

const upload = multer({ storage: storage });

posts.post('/add', upload.single('file'), async (req, res) => {
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

    const { title, body, user_id } = req.body
    let file = ""
    if (req.file) {
        file = req.file.filename
    }
    
    if (!(title && body && user_id)){
        return res.status(400).json({ success: false, msg: "Please fill in all the fields and log in first!" });
    }

    // TODO: verify user input before sending to DB
    const queryResult = await DB.addPost(title, body, file, user_id);
    if (!(queryResult.affectedRows)) {
        return res.status(500).json({ success: false, msg: "Error processing new post..." });
    }
    return res.status(200).json({ success: true, msg: "New post succesfully added!" });
})

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
