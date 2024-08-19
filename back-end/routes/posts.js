const express = require("express")
const posts = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const nodemailer = require('nodemailer')

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'uploads')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() + `${file.originalname}`)
    }
})

// const upload = multer({ storage: storage })

const upload = multer({
    storage: storage,
    fileFilter: (req, file, callBack) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  // check mimetype
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())   // check extension (lowercase so it matches)

        if (mimeType && extname) {
            return callBack(null, true)
        } else {
            // callBack('Error: File upload only supports the following filetypes - ' + fileTypes, false)
            req.fileValidationError = 'Error: File upload only supports the following filetypes - ' + fileTypes
            return callBack(null, false)
        }
    }
})

posts.post('/add', UTILS.authorizeLogin, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, msg: req.fileValidationError })
        }
        if (err) {
            return res.status(500).json({ success: false, msg: "Error while uploading file." })
        }
        next()
    })
}, async (req, res) => {
    try {
        const { title, body, username, category } = req.body
        let file = ""
        if (req.file) {
            file = req.file.filename
        }

        if (!(title && body && username && category !== "")) {
            return res.status(400).json({ success: false, msg: "Please fill in all the fields and log in first!" })
        }

        let category_id = category
        if (!UTILS.verifyCategoryNumber(category)) {
            try {
                let queryCaregoryRes = await DB.authCategory(category)
                if (queryCaregoryRes.length >= 1) {
                    return res.status(503).json({ success: false, msg: "Category already exists in DB..." })
                }

                const queryAddCat = await DB.addCategory(category)
                if (!queryAddCat.affectedRows) {
                    return res.status(503).json({ success: false, msg: "Failed saving category in the DB..." })
                }

                queryCaregoryRes = await DB.authCategory(category)
                category_id = queryCaregoryRes[0].id
                if (!UTILS.verifyId) {
                    return res.status(503).json({ success: false, msg: "Error while saving category in the DB..." })
                }
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Error while processing DB for category..." })
            }
        }

        let user_id = null
        try {
            const q = await DB.getIdByUsername(username)
            if (!q[0]) {
                return res.status(400).json({ success: false, msg: "No such user found!" })
            }
            user_id = q[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while checking for user in DB..." })
        }

        // TODO: verify user input before sending to DB
        try {
            const queryResult = await DB.addPost(title, body, file, user_id, category_id)
            if (!(queryResult.affectedRows)) {
                return res.status(503).json({ success: false, msg: "Error processing new post..." })
            }

            return res.status(200).json({ success: true, msg: "New post successfully added!", id: queryResult.insertId })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error... Try adding your post later." })
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

let transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD
    },
    tls: {
        ciphers: 'SSLv3'
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
            // return res.status(200).json({ success: true, msg: "Comment successfully saved in DB!" })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error saving comment in DB..." })
        }

        // TODO: notify author via email that someone commented on their post
        let author = null
        try {
            author = await DB.findUserByPostId(post_id)
            if (author.length <= 0) {
                return res.status(404).json({ success: false, msg: "No post, hense no author found..." })
            }
        } catch (error) {
            console.error(error)
            return res.status(404).json({ success: false, msg: "Cannot find post in DB..." })
        }
        let mailOptions = {
            from: process.env.MY_EMAIL,
            to: author[0].email,
            subject: 'New Comment - Tech Skill-Swap',
            html: `
                <p>You are receiving this because you (or someone else) commented on one of
                your posts.</p>

                <p>${user} commented on: ${author[0].title} the following: ${content} </p>
                
                <p>Please click on the following link, or paste this into your browser to 
                open and view the latest notifications for your content.</p>

                <a href="http://88.200.63.148:8127/">Log in to your Account</a>
                `
        }
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, msg: "Error commenting (or sending mail)." })
            } else {
                return res.status(200).json({ success: true, msg: "Comment saved in DB!" })
            }
        })

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

posts.delete('/:id', UTILS.authorizeLogin, async (req, res) => {
    try {
        const id = req.params.id
        if (!UTILS.verifyId(id)) {
            return res.status(400).json({ success: false, msg: "Bad post id!" })
        }

        let post
        try {
            post = await DB.onePost(id)
            if (!post) {
                return res.status(404).json({ success: false, msg: "Post not found." })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while retrieving post from DB..." })
        }

        // this is completely from internet, idk why I have ENOENT
        if (post[0].image) {
            const filePath = path.join(__dirname, '../uploads', post[0].image)
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("Error deleting file:", err)
                    return res.status(500).json({ success: false, msg: "Error deleting associated file." })
                }
            })
        }

        try {
            const queryResult = await DB.deletePost(id)
            if (queryResult.affectedRows <= 0) {
                return res.status(404).json({ success: false, msg: "Failed to delete post." })
            }
            return res.status(200).json({ success: true, msg: "Post deleted successfully." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json("Internal server error. Try again later.")
    }
})

posts.get('/search/:payload', async (req, res) => {
    try {
        const payload = req.params.payload

        // TODO: verify user input
        try {
            const queryResult = await DB.searchPosts(payload)
            if (queryResult.length <= 0)
                return res.status(503).json({ success: false, msg: "Error while searching for posts." })
            return res.status(200).json({ success: true, msg: "Posts succesfully fetched/searched", posts: queryResult })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "An error occured while processing DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Something internally snapped! Try again later." })
    }
})

posts.get('/category/get', async (req, res) => {
    try {
        const queryResult = await DB.fetchCategories()
        if (queryResult.length <= 0) {
            return res.status(503).json({ syccess: false, msg: "No categories fetched... Snap!" })
        }
        return res.status(200).json({ success: true, msg: "Categories succesfully fetched", arr: queryResult })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error while fetching categories..." })
    }
})

posts.get('/category/get/:id', async (req, res) => {
    try {
        const queryResult = await DB.fetchPostsByGivenCategory(req.params.id)
        if (queryResult.length <= 0) {
            return res.status(503).json({ syccess: false, msg: "No posts with that category fetched..." })
        }

        return res.status(200).json({ success: true, msg: "Posts succesfully fetched", arr: queryResult })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error while fetching categories..." })
    }
})

posts.post('/edit', UTILS.authorizeLogin, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, msg: req.fileValidationError })
        }
        if (err) {
            return res.status(500).json({ success: false, msg: "Error while uploading file." })
        }
        next()
    })
}, async (req, res) => {
    try {
        const { title, body, username, category, old_post_id, del_img } = req.body

        let currentPost = null
        try {
            currentPost = await DB.onePost(old_post_id)
            if (currentPost.length <= 0) {
                return res.status(404).json({ success: false, msg: "Post not found..." })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Server snapped while processing DB for picture..." })
        }

        let file = currentPost[0].image
        if (req.file) {
            file = req.file.filename
            if (currentPost[0].image) {
                const filePath = path.join(__dirname, '../uploads', currentPost[0].image)
                fs.unlink(filePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error("Error deleting file:", err)
                        return res.status(500).json({ success: false, msg: "Error deleting associated file." })
                    }
                })
            }
        }

        if (del_img === "true") {
            file = ""
            if (currentPost[0].image) {
                const filePath = path.join(__dirname, '../uploads', currentPost[0].image)
                fs.unlink(filePath, (err) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error("Error deleting file:", err)
                        return res.status(500).json({ success: false, msg: "Error deleting associated file." })
                    }
                })
            }
        }

        if (!(title && body && username && category !== "")) {
            return res.status(400).json({ success: false, msg: "Please fill in all the fields and log in first!" })
        }

        let category_id = category
        if (!UTILS.verifyCategoryNumber(category)) {
            try {
                let queryCaregoryRes = await DB.authCategory(category)
                if (queryCaregoryRes.length >= 1) {
                    return res.status(503).json({ success: false, msg: "Category already exists in DB..." })
                }

                const queryAddCat = await DB.addCategory(category)
                if (!queryAddCat.affectedRows) {
                    return res.status(503).json({ success: false, msg: "Failed saving category in the DB..." })
                }

                queryCaregoryRes = await DB.authCategory(category)
                category_id = queryCaregoryRes[0].id
                if (!UTILS.verifyId) {
                    return res.status(503).json({ success: false, msg: "Error while saving category in the DB..." })
                }
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Error while processing DB for category..." })
            }
        }

        let user_id = null
        try {
            const q = await DB.getIdByUsername(username)
            if (!q[0]) {
                return res.status(400).json({ success: false, msg: "No such user found!" })
            }
            user_id = q[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while checking for user in DB..." })
        }

        // TODO: verify user input before sending to DB
        try {
            const queryResult = await DB.editPost(title, body, file, user_id, category_id, old_post_id)
            if (!(queryResult.affectedRows)) {
                return res.status(503).json({ success: false, msg: "Error processing the post..." })
            }

            return res.status(200).json({ success: true, msg: "New post successfully edited!", id: Number(old_post_id) })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error... Try editing your post later." })
    }
})

module.exports = posts