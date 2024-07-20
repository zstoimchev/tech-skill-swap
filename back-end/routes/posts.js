const express = require("express")
const posts = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })

posts.post('/add', UTILS.authorizeLogin, upload.single('file'), async (req, res) => {
    const { title, body, username } = req.body
    let file = ""
    if (req.file) {
        file = req.file.filename
    }

    if (!(title && body && username)) {
        return res.status(400).json({ success: false, msg: "Please fill in all the fields and log in first!" })
    }

    // TODO: verify user input before sending to DB
    try {
        const queryResult = await DB.addPost(title, body, file, username)
        if (!(queryResult.affectedRows)) {
            return res.status(503).json({ success: false, msg: "Error processing new post..." })
        }
        return res.status(200).json({ success: true, msg: "New post successfully added!" })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

posts.get('/', async (req, res) => {
    try {
        const queryResult = await DB.allPostsJ()
        return res.status(200).json({ arr: queryResult, success: true, msg: "All posts fetched successfully." })
    }
    catch (err) {
        console.error(err)
        return res.status(503).json({ success: false, msg: "Cannot fetch any post! Try again later." })
    }
})

posts.get('/:id', UTILS.authorizeLogin, async (req, res) => {

    try {
        if (!(UTILS.verifyId(req.params.id))) {
            return res.status(400).json({ success: false, msg: "Bad post ID! Try again." })
        }

        try {
            const queryResult = await DB.onePost(req.params.id)
            if (!queryResult[0]) {
                return res.status(404).json({ success: false, msg: "No such post found in the DB!" })
            }
            return res.status(200).json({ arr: queryResult[0], success: true, msg: "Post successfully fetched." })
        }
        catch (err) {
            console.error(err)
            return res.status(503).json({ success: false, msg: "Cannot fetch post from the DB. Try again later." })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

posts.post('/comment', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { user, post_id, content } = req.body
        if (!UTILS.verifyUsername(user)) {
            return res.status(404).json({ success: false, msg: "No such user found! Please register first." })
        }

        let id = null
        try {
            id = await DB.getIdByUsername(user)
            if (!id) {
                return res.status(404).json({ success: false, msg: "No such user found!" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing user..." })
        }

        if (!(UTILS.verifyId(post_id))) {
            return res.status(400).json({ success: false, msg: "Bad post ID! Try again." })
        }

        // TODO: verify the content from the user
        try {
            const queryResult = await DB.addComment(id[0].id, post_id, content)
            if (!queryResult.affectedRows) {
                return res.status(503).json({ success: false, msg: "Error saving comment to DB..." })
            }
            return res.status(200).json({ success: true, msg: "Comment successfully saved in DB!" })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error saving comment in DB..." })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

posts.get('/comment/:id', UTILS.authorizeLogin, async (req, res) => {
    try {
        const queryResult = await DB.getCommentsByPostId(req.params.id)
        return res.status(200).json({ arr: queryResult, success: true, msg: "Comments successfully fetched." })
    }
    catch (err) {
        console.error(err)
        return res.status(503).json({ success: false, msg: "Something happened. Internal server error. Cannot fetch comments. Try again later." })
    }
})

module.exports = posts