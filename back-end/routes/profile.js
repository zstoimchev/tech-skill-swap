const express = require("express")
const profile = express.Router()
const DB = require('../DB/dbConn.js')


profile.get('/:username', async (req, res) => {
    try {
        // from username, get * for the user. For that ID, fetch all the posts, send them
        const username = req.params.username

        let user = null
        try {
            user = await DB.authUsername(username)
        } catch (error) {
            return res.status(404).json({ success: false, msg: "No such user found!" })
        }

        const posts = await DB.getAllPostsByUserId(user[0].id)
        return res.status(200).json({ success: true, msg: "User and posts succesfully fetched.", userData: user[0], postsData: posts })

    } catch (err) {
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

module.exports = profile