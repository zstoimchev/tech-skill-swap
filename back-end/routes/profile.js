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
        return res.status(200).json({ success: true, msg: "User and posts succesfully fetched.", userData: user[0], postData: posts })

    } catch (err) {
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.post('/complete-profile', async (req, res, next) => {
    try {
        const { role, email, interests, skills, about } = req.body

        // TODO: verify user data before sending to server

        const userr_idd = await DB.getIdByEmail(email)
        if (!userr_idd) {
            return res.status(404).json({ success: false, msg: "No such user found!" })
        }
        if (role === "both") {
            const q1 = await DB.addRoleDataHelper(userr_idd[0].id, skills, about)
            const q2 = await DB.addRoleDataSeeker(userr_idd[0].id, interests, about)
            if (!(q1.affectedRows > 0 && q2.affectedRows > 0)) {
                return res.status(500).json({ success: false, msg: "Failed saving user role in DB" })
            }
        } else if (role === "Helper") {
            const q = await DB.addRoleDataHelper(userr_idd[0].id, skills, about)
            if (!q.affectedRows) {
                return res.status(500).json({ success: false, msg: "Failed saving user data in DB" })
            }
        } else if (role === "Seeker") {
            const q = await DB.addRoleDataSeeker(userr_idd[0].id, interests, about)
            if (!q.affectedRows) {
                return res.status(500).json({ success: false, msg: "Failed saving user data in DB" })
            }
        }

        return res.status(200).json({ success: true, msg: "User role data succsfully set in the DB!" })
    } catch (err) {
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

module.exports = profile