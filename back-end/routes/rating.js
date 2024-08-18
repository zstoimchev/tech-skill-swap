const express = require("express")
const rating = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')
const nodemailer = require('nodemailer')


rating.get('/:post_id', async (req, res) => {
    try {
        const queryRes = await DB.fetchRatings(req.params.post_id)
        if (queryRes[0].rating)
            return res.status(200).json({ success: true, msg: "Ratings fetched!", rating: queryRes[0].rating })
        return res.status(200).json({ success: true, msg: "No ratings found yet...", rating: 0.0 })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

rating.get('/fetch-user/:post_id/:user', async (req, res) => {
    try {
        const user = req.params.user
        const post_id = req.params.post_id
        let user_id = null
        try {
            const queryRess = await DB.authUsername(user)
            if (queryRess.length <= 0)
                return res.status(404).json({ success: false, msg: "User not found!" })
            user_id = queryRess[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing DB for user..." })
        }

        const queryRes = await DB.fetchRatingForUserOnPost(user_id, post_id)
        if (queryRes.length <= 0)
            return res.status(200).json({ success: true, msg: "No rating found...", rating: 'N/A' })
        return res.status(200).json({ success: true, msg: "Rating fetched!", rating: queryRes[0].star })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
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

rating.post('/add', async (req, res) => {
    try {
        const { user, post_id, value } = req.body
        let user_id = null
        try {
            const queryRess = await DB.authUsername(user)
            if (queryRess.length <= 0)
                return res.status(404).json({ success: false, msg: "User not found!" })
            user_id = queryRess[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing DB for user..." })
        }

        try {
            const isPresent = await DB.getRatingByUserAndPostId(user_id, post_id)
            let queryRes = null
            if (isPresent.length <= 0) {
                queryRes = await DB.addRating(user_id, post_id, value)
            } else {
                queryRes = await DB.updateRating(user_id, post_id, value)
            }
            if (!queryRes.affectedRows)
                return res.status(404).json({ success: false, msg: "Post not found..." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing DB for user comment" })
        }

        // TODO: send mail to author that someone rated
        // find the person, the author email and send the email

        // let mailOptions = {
        //     from: process.env.MY_EMAIL,
        //     to: email,
        //     subject: 'New Rating - Tech Skill-Swap',
        //     html: `
        //         <p>You are receiving this because you (or someone else) have submitted 
        //         a rating for one of your posts.</p>
                
        //         <p>Please click on the following link, or paste this into your browser to review
        //         the latest interactions on your posts:</p>
                
        //         <a href="http://88.200.63.148:8127/">Visit Account</a>

        //         <p>If you did not request this, please ignore this email, hence no changes will be made.</p>
        //         `
        // }

        // transporter.sendMail(mailOptions, (err, response) => {
        //     if (err) {
        //         return res.status(500).json({ success: false, msg: "Error sending mail to the user." })
        //     } else {
        //         return res.status(200).json({ success: true, msg: "Rating saved!" })
        //     }
        // })

        return res.status(200).json({ success: true, msg: "Rating saved!" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

module.exports = rating