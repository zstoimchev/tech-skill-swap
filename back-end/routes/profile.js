const express = require("express")
const profile = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')


profile.get('/:username', async (req, res) => {
    try {
        const username = req.params.username

        let user = null
        try {
            user = await DB.authUsername(username)
        } catch (error) {
            return res.status(404).json({ success: false, msg: "No such user found!" })
        }

        let posts = null
        try {
            posts = await DB.getAllPostsByUserId(user[0].id)
        } catch (error) {
            return res.status(503).json({ success: false, msg: "Error while fetching posts from the DB." })
        }

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

profile.post('/change-name-surname', async (req, res) => {
    try {
        const { name, surname, user } = req.body
        if (!(name && surname && user)) {
            return res.status(400).json({ success: false, msg: "Please enter valid name and surname." })
        }

        if (!(UTILS.verifyUsername(user))) {
            return res.status(400).json({ success: false, msg: "Please provide valid username!" })
        }

        if (!(UTILS.verifyNameSurname(name, surname))) {
            return res.status(400).json({ success: false, msg: "Please provide valid name and surname!" })
        }

        try {
            const queryResult = await DB.authUsername(user)
            if (!queryResult) {
                return res.status(503).json({ success: false, msg: "Cannot find such user in the DB" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "An error occured while processing DB..." })
        }

        try {
            const querr = await DB.changeName(name, surname, user)
            if (!querr) {
                return res.status(503).json({ success: false, msg: "Error while updating name or surname in the DB." })
            }
            return res.status(200).json({ success: true, msg: "Name and surname succesfully changed." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while altering user row in DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

profile.post('/change-email', async (req, res) => {
    try {
        const { email, user } = req.body
        if (!(email && user)) {
            return res.status(400).json({ success: false, msg: "Please enter valid email and log in." })
        }

        if (!(UTILS.verifyUsername(user))) {
            return res.status(400).json({ success: false, msg: "Please provide valid username!" })
        }

        if (!(UTILS.verifyEmail(email))) {
            return res.status(400).json({ success: false, msg: "Please provide valid email address!" })
        }

        try {
            const queryResult = await DB.authUsername(user)
            if (!queryResult) {
                return res.status(503).json({ success: false, msg: "Cannot find such user in the DB" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "An error occured while processing DB..." })
        }
        
        try {
            const queryResultEmail = await DB.authEmail(email)
            if (queryResultEmail.length != 0) {
                return res.status(400).json({ success: false, msg: "User with that E-mail already exists!" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error processing DB. Please try again later" })
        }

        try {
            const querr = await DB.changeEmail(email, user)
            if (!querr) {
                return res.status(503).json({ success: false, msg: "Error while updating name or surname in the DB." })
            }
            return res.status(200).json({ success: true, msg: "Email succesfully changed." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while altering user row in DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

module.exports = profile