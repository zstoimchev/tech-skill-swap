const express = require("express")
const profile = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')


profile.get('/:username', UTILS.authorizeLogin, async (req, res) => {
    try {
        const username = req.params.username

        let user = null
        try {
            user = await DB.authUsernameWithRole(username)
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

profile.post('/complete-profile', UTILS.authorizeLogin, async (req, res, next) => {
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

profile.post('/change-name-surname', UTILS.authorizeLogin, async (req, res) => {
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

profile.post('/change-email', UTILS.authorizeLogin, async (req, res) => {
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
                return res.status(503).json({ success: false, msg: "Error while updating email in the DB." })
            }
            return res.status(200).json({ success: true, msg: "Email succesfully changed." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating user row in DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})


profile.post('/change-username', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { username, user } = req.body
        if (!(username && user)) {
            return res.status(400).json({ success: false, msg: "Please enter valid username and log in." })
        }

        if (!(UTILS.verifyUsername(user) && UTILS.verifyUsername(username))) {
            return res.status(400).json({ success: false, msg: "Please provide valid username!" })
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
            const queryResultUsername = await DB.authUsername(username)
            if (queryResultUsername.length != 0) {
                return res.status(400).json({ success: false, msg: "User with that Username already exists!" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error processing DB. Please try again later." })
        }

        try {
            const querr = await DB.changeUsername(username, user)
            if (!querr) {
                return res.status(503).json({ success: false, msg: "Error while updating username in the DB." })
            }
            return res.status(200).json({ success: true, msg: "Username succesfully changed. Please logout and log in so the changes take effect." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating user row in DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})


profile.post('/change-password', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { oldpassword, newpassword, newpassword2, user } = req.body

        if (!(UTILS.verifyPassStrength(newpassword) && UTILS.verifyPassStrength(newpassword2) && UTILS.verifyUsername(user))) {
            return res.status(400).json({ success: false, msg: "Please provide valid password! Check password strength." })
        }

        let userData = null
        try {
            userData = await DB.authUsername(user)
            if (!userData) {
                return res.status(404).json({ success: false, msg: "Cannot find such user in the DB" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "An error occured while processing DB..." })
        }

        if (!(UTILS.comparePassword(oldpassword, userData[0].password))) {
            return res.status(400).json("Old password does not match!")
        }

        if (newpassword !== newpassword2) {
            return res.status(400).json({ success: false, msg: "New password does not match!" })
        }

        const newPW = await UTILS.hashPassword(newpassword)
        try {
            const querr = await DB.changePass(newPW, userData[0].email)
            if (!querr) {
                return res.status(503).json({ success: false, msg: "Error while updating password in the DB." })
            }
            return res.status(200).json({ success: true, msg: "Password succesfully changed." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating user row in DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

profile.post('/change-about', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { user, about } = req.body
        if (!UTILS.verifyUsername(user)) {
            return res.status(400).json({ success: false, msg: "Bad username!" })
        }
        // TODO: verify the about user input

        let userId = null
        try {
            const queryUsername = await DB.authUsername(user)
            if (!queryUsername)
                return res.status(404).json({ success: false, msg: "No such user found!" })
            userId = queryUsername[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing the DB..." })
        }

        try {
            const q1 = await DB.updateHelperAbout(about, userId)
            const q2 = await DB.updateSeekerAbout(about, userId)
            if (!(q1.affectedRows > 0 && q2.affectedRows > 0)) {
                return res.status(503).json({ success: false, msg: "Failed saving user role in DB" })
            }

            return res.status(200).json({ success: true, msg: "Succesfully updated about section in DB." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating the DB..." })
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Try again later." })
    }

})

module.exports = profile