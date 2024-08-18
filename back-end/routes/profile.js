const express = require("express")
const profile = express.Router()
const DB = require('../DB/dbConn.js')
const UTILS = require('../utils/functions.js')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


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

        let role = null
        try {
            const q1 = await DB.authRole("Seeker", user[0].id)
            const q2 = await DB.authRole("Helper", user[0].id)

            if (q1.length > 0 && q2.length > 0)
                role = "Both Helper and Seeker, asking and requesting for help."
            else if (q1.length > 0 && q2.length === 0)
                role = "Seeker, asking people for help."
            else if (q1.length === 0 && q2.length > 0)
                role = "Helper, requesting to help with some skills."
            else
                role = "No specified role yet."
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Failed processing DB..." })
        }

        return res.status(200).json({ success: true, msg: "User and posts succesfully fetched.", userData: user[0], postData: posts, roleData: role })
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

        let queryResultEmail = null
        try {
            queryResultEmail = await DB.authUsername(user)
            if (!queryResultEmail) {
                return res.status(404).json({ success: false, msg: "Cannot find such user in the DB" })
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

        // pack and email token
        const secretKey = process.env.JWT_TOKEN_SECRET
        const expiresIn = '15min'
        const token = jwt.sign({ oldEmail: queryResultEmail[0].email, newEmail: email }, secretKey, { expiresIn })

        let mailOptions = {
            from: process.env.MY_EMAIL,
            to: queryResultEmail[0].email,
            subject: 'Change of Email - Tech Skill-Swap',
            html: `
                <p>You are receiving this because you (or someone else) have requested 
                change of email using this email address.</p>
                
                <p>Please click on the following link, or paste this into your browser to complete 
                the process within 15 minutes of receiving it:</p>
                
                <a href="http://88.200.63.148:8127/activate-account/${token}">Activate Account</a>

                <p>If you did not request this, please ignore this email, hence no changes will be made.</p>
                `
        }
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                return res.status(500).json({ success: false, msg: "Error sending mail to the user." })
            } else {
                return res.status(200).json({ success: true, msg: "Confirmation email sent to old email address!" })
            }
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error. Please try again later." })
    }
})

profile.post('/activate-email/:token', async (req, res) => {
    try {
        const token = req.params.token
        const secretKey = process.env.JWT_SECRET
        try {
            const decoded = jwt.verify(token, secretKey)
            const oldEmail = decoded.oldEmail
            const newEmail = decoded.newEmail

            if (!(UTILS.verifyEmail(oldEmail) && UTILS.verifyEmail(newEmail))) {
                return res.status(400).json({ success: false, msg: "Please provide valid email address!" })
            }

            const user = await DB.authEmail(oldEmail)
            if (user.length <= 0) {
                return res.status(404).json({ success: false, msg: "User not found!" })
            }

            const queryResultEmail = await DB.authEmail(newEmail)
            if (queryResultEmail.length != 0) {
                return res.status(400).json({ success: false, msg: "User with that E-mail already exists!" })
            }

            try {
                const querr = await DB.changeEmail(newEmail, user[0].username)
                if (!querr) {
                    return res.status(503).json({ success: false, msg: "Error while updating email in the DB." })
                }
                return res.status(200).json({ success: true, msg: "Email succesfully changed." })
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Error while updating user row in DB..." })
            }

        } catch (err) {
            return res.status(401).json({ success: false, msg: "Invalid or expired token!" })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Something internally snapped..." })
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

        const storedHashedPassword = userData[0].password
        const isPasswordMatch = await UTILS.comparePassword(oldpassword, storedHashedPassword)

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, msg: "Old password does not match!" })
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
            if (!(q1.affectedRows > 0 || q2.affectedRows > 0)) {
                return res.status(503).json({ success: false, msg: "Failed saving about section in DB" })
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

profile.post('/change-skills', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { skills, user } = req.body
        if (!UTILS.verifyUsername(user)) {
            return res.status(400).json({ success: false, msg: "Bad username!" })
        }
        // TODO: verify the skills user input

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
            const q1 = await DB.updateSkills(skills, userId)
            if (!q1.affectedRows > 0) {
                return res.status(503).json({ success: false, msg: "Failed saving user skills in DB" })
            }

            return res.status(200).json({ success: true, msg: "Succesfully updated skills section in DB." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating the DB..." })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.post('/change-interests', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { interests, user } = req.body
        if (!UTILS.verifyUsername(user)) {
            return res.status(400).json({ success: false, msg: "Bad username!" })
        }
        // TODO: verify the interests user input

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
            const q1 = await DB.updateInterests(interests, userId)
            if (!q1.affectedRows > 0) {
                return res.status(503).json({ success: false, msg: "Failed saving user interests in DB" })
            }

            return res.status(200).json({ success: true, msg: "Succesfully updated interests section in DB." })
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while updating the DB..." })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.post('/change-role', UTILS.authorizeLogin, async (req, res) => {
    try {
        const { role, oldRole, user } = req.body
        if (!(UTILS.verifyRole(role)))
            return res.status(400).json({ success: false, msg: "Bad role submitted!" })
        let userId = null
        try {
            const queryUser = await DB.authUsername(user)
            if (queryUser.length === 0)
                return res.status(404).json({ success: false, msg: "No such user found! Log in again." })
            userId = queryUser[0].id
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Failed processing DB while checking user." })
        }

        if (role === "Seeker") {
            try {
                const queryDeleteRole = await DB.removeHelper(userId)

                if (oldRole === "both" || oldRole === "Seeker")
                    return res.status(200).json({ success: true, msg: "Role succesfully submitted" })

                const queryChangeRole = await DB.addSeekerRole(userId)
                if (!queryChangeRole.affectedRows)
                    return res.status(503).json({ success: false, msg: "Failed to update new role." })

                return res.status(200).json({ success: true, msg: "Role succesfully updated." })
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Failed processing DB to change role..." })
            }
        }

        else if (role === "Helper") {
            try {
                const queryDeleteRole = await DB.removeSeeker(userId)

                if (oldRole === "both" || oldRole === "Helper")
                    return res.status(200).json({ success: true, msg: "Role succesfully submitted" })

                const queryChangeRole = await DB.addHelperRole(userId)
                if (!queryChangeRole.affectedRows)
                    return res.status(503).json({ success: false, msg: "Failed to update new role." })

                return res.status(200).json({ success: true, msg: "Role succesfully updated." })
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Failed processing DB to change role..." })
            }
        }

        else if (role === "both") {
            // auth both tables, the one that has length 0, add that role
            let q1Role = null
            let q2Role = null
            try {
                q1Role = await DB.authRole("Seeker", userId)
                q2Role = await DB.authRole("Helper", userId)
            } catch (error) {
                console.error(error)
                return res.status(503).json({ success: false, msg: "Failed authenticating role..." })
            }

            if (q1Role.length === 0) {
                try {
                    const queryChangeRole1 = await DB.addSeekerRole(userId)
                    if (!queryChangeRole1.affectedRows)
                        return res.status(503).json({ success: false, msg: "Failed to update new role." })
                } catch (error) {
                    console.error(error)
                    return res.status(503).json({ success: false, msg: "Failed processing DB while changing role." })
                }
            }
            if (q2Role.length === 0) {
                try {
                    const queryChangeRole2 = await DB.addHelperRole(userId)
                    if (!queryChangeRole2.affectedRows)
                        return res.status(503).json({ success: false, msg: "Failed to update new role." })
                } catch (error) {
                    console.error(error)
                    return res.status(503).json({ success: false, msg: "Failed processing DB while changing role." })
                }
            }
            return res.status(200).json({ success: true, msg: "Role succesfully updated." })
        }
        else
            return res.status(400).json({ success: false, msg: "Invalid role submitted! Try again later." })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.get('/comments/:id', async (req, res) => {
    try {
        const username = req.params.id
        // if (UTILS.verifyUsername(username)) {
        //     return res.status(400).json({ success: false, msg: "Username not valid!" })
        // }

        let user = null
        try {
            user = await DB.authUsername(username)
            if (user.length <= 0)
                return res.status(404).json({ success: false, msg: "User not found..." })
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, msg: "Error while processing DB for user..." })
        }

        let comments = null
        try {
            comments = await DB.fetchCommentsFromPerson(user[0].id)
            if (comments.length <= 0) {
                return res.status(500).json({ success: false, msg: "No comments fetched..." })
            }
        } catch (error) {
            console.error(error)
            return res.status(500).json({ success: false, msg: "Error while processing DB for comments..." })
        }

        return res.status(200).json({ success: true, msg: "Comments fetched succesfully.", comments: comments })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.delete('/comments/:id', async (req, res) => {
    try {
        const result = await DB.deleteComment(req.params.id)
        if (!result.affectedRows)
            return res.status(400).json({ success: false, msg: "Error deleting comment..." })
        return res.status(200).json({ success: true, msg: "Comment deleted succesfully!" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

profile.post('/comments/', async (req, res) => {
    try {
        const {id, content} = req.body
        const result = await DB.editComment(id, content)
        if (!result.affectedRows)
            return res.status(400).json({ success: false, msg: "Error editing comment..." })
        return res.status(200).json({ success: true, msg: "Comment edited succesfully!" })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ success: false, msg: "Internal server error..." })
    }
})

module.exports = profile