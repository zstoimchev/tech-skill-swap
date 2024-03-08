
const express = require("express")
const posts = express.Router();
const DB = require('../db/dbConn.js')
const multer = require("multer")


// gets all the posts in the DB 
posts.get('/', async (req, res, next) => {
    if (!req.session.logged_in) {
        res.json({
            success: false,
            msg: "Can not load posts. You need to log-in!"
        })
        return
    }
    try {
        const queryResult = await DB.allPosts();
        res.json(queryResult)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
        next()
    }
})

// gets one post based on the id 
posts.get('/:id', async (req, res, next) => {
    if (!req.session.logged_in) {
        res.json({
            success: false,
            msg: "Can not load post. You need to log-in!"
        })
        return
    }
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

// inserts one post to the database
posts.post('/', /*upload_dest.single('file'),*/ async (req, res, next) => {
    if (!req.session.logged_in) {
        res.json({
            success: false,
            msg: "Can not add post. You need to log-in!"
        })
        return
    }
    try {
        // const user_id = req.session.user_id
        const user_id = req.session.user[0].id;
        const title = req.body.title
        const body = req.body.body
        let image = ""
        if (req.image != null)
            image = req.image.imagename

        const isAcompleteNovica = user_id && title && body
        if (isAcompleteNovica) {
            const queryResult = await DB.cretePost(user_id, title, body, image)
            if (queryResult.affectedRows) {
                console.log("New post added!!")
                res.statusCode = 200
                res.send(
                    {
                        success: true,
                        msg: "News item added"
                    })
            }
        } else {
            console.log("A field is empty!!")
            res.statusCode = 200
            res.send({ success: false, msg: "Input item missing" })
        }
        res.end()

    } catch (err) {
        console.log(err)
        res.sendStatus(500)
        next()
    }
})

module.exports = posts