const express = require("express")
const users = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const UTILS = require('../utils/functions.js')


users.post('/login', UTILS.authorizeLoginForLogin, async (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!(username && password)) {
            return res.status(400).json({ success: false, msg: "Please enter both Username & Password!" })     // bad request
        }

        if (!(UTILS.verifyUsername(username))) {
            return res.status(400).json({ success: false, msg: "Bad username, contains disallowed characters!" })
        }

        let queryResult = null
        try {
            queryResult = await DB.authUsername(username)
            if (queryResult.length <= 0) {
                return res.status(404).json({ success: false, msg: "Username does not exist. Please create new account!" })    // not found
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while processing username... Please try again later." })
        }

        const storedHashedPassword = queryResult[0].password
        const isPasswordMatch = await UTILS.comparePassword(password, storedHashedPassword)

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, msg: "Incorrect password!" })    // unauthorized access
        }

        // TODO: set up refresh token for the JWT
        const secretKey = process.env.JWT_TOKEN_SECRET
        const expiresIn = '1h'
        const token = jwt.sign({ user: username }, secretKey, { expiresIn })

        console.log("User successfully logged in!")
        return res.status(200).json({ success: true, token: token, user: queryResult[0].username, msg: "User is logged in!" })  // all ok
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, msg: `Internal server error! Try again later.` })     // internal server error
    }
})


// TODO: when registering, verify the user with email confirmation???
// =========================================================================================================================================\
// How to confirm registration with email? Create JWT with expiration date 15 minutes and email it. When the user oppens the link           |
// with the token, extract the data. Check if in the DB there is already user with that email or with that address. If there is,            |
// return error to the frontend that in the meantime someone registered user with that email/username, otherwise save the user to the DB    |
// =========================================================================================================================================/
users.post('/register', UTILS.authorizeLoginForLogin, async (req, res) => {
    // TODO: implement middleware function that will check user input only
    try {
        const { name, surname, username, email, password, password2, role } = req.body

        if (!(name && surname && username && email && password && password2 && role)) {
            return res.status(400).json({ success: false, msg: "Input field missing! Please fill in all the fields." })
        }

        if (!(UTILS.verifyEmail(email))) {
            return res.status(400).json({ success: false, msg: "Bad email, contains disallowed characters!" })
        }

        if (!(UTILS.verifyUsername(username))) {
            return res.status(400).json({ success: false, msg: "Bad username, contains disallowed characters!" })
        }

        if (!(UTILS.verifyNameSurname(name, surname))) {
            return res.status(400).json({ success: false, msg: "Bad name/surname, contains disallowed characters!" })
        }

        if (!(UTILS.verifyRole(role))) {
            return res.status(400).json({ success: false, msg: "Bad role, please try again." })
        }

        if (password !== password2) {
            return res.status(401).json({ success: false, msg: "Passwords do not match!" })
        }

        try {
            const queryResultEmail = await DB.authEmail(email)
            if (queryResultEmail.length != 0) {
                return res.status(400).json({ success: false, msg: "User with that E-mail already exists!" })
            }
            const queryResultUsername = await DB.authUsername(username)
            if (queryResultUsername.length > 0) {
                return res.status(400).json({ success: false, msg: "User with that Username already exists!" })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error processing DB. Please try again later" })
        }

        if (!(UTILS.verifyPassStrength(password))) {
            return res.status(400).json({ success: false, msg: "Bad password, check password strength!" })
        }

        const hashedPassword = await UTILS.hashPassword(password)
        if (!hashedPassword) {
            return res.status(500).json({ success: false, msg: "Error while processing password. Please try again later." })
        }

        try {
            const queryResult = await DB.addUser(name, surname, username, email, hashedPassword)
            if (!(queryResult.affectedRows)) {
                return res.status(500).json({ success: false, msg: "Error registering new user..." })
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "Error while saving user in DB... Please try again later." })
        }

        try {
            const userr_idd = await DB.getIdByEmail(email)
            if (!userr_idd) {
                return res.status(404).json({ success: false, msg: "No such user found!" })
            }
            if (role === "both") {
                const q1 = await DB.addRole("Helper", userr_idd[0].id)
                const q2 = await DB.addRole("Seeker", userr_idd[0].id)
                if (!(q1.affectedRows > 0 && q2.affectedRows > 0)) {
                    return res.status(500).json({ success: false, msg: "Failed saving user role in DB" })
                }
            } else if (role === "Helper") {
                const q = await DB.addRole(role, userr_idd[0].id)
                if (!q.affectedRows) {
                    return res.status(500).json({ success: false, msg: "Failed saving user role in DB" })
                }
            } else if (role === "Seeker") {
                const q = await DB.addRole(role, userr_idd[0].id)
                if (!q.affectedRows) {
                    return res.status(500).json({ success: false, msg: "Failed saving user role in DB" })
                }
            }
        } catch (error) {
            console.error(error)
            return res.status(503).json({ success: false, msg: "User saved, but failed processing role..." })
        }

        return res.status(200).json({ success: true, msg: "New user successfully registered." })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, msg: "Something happened internally! Please try again later." })
    }
})

users.get('/auth', UTILS.authorizeLogin, async (req, res) => {
    // maybe refresh the jwt here? Plenty of time for that, will do when the time comes!
    return res.status(200).json({ success: true, user: req.user, msg: "User is logged in!" })
})


// Some way of logging, keeping logs of what is going on, like which user logs in registers logs out at what time etc.

module.exports = users