const express = require("express")
const users = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const UTILS = require('../utils/functions.js')


users.post('/login', async (req, res, next) => {
    try {
        // TODO: if there is already a JWT token, refuse the request

        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).json({ success: false, msg: "Please enter both Username & Password!" });     // bad request
        }

        if (!(UTILS.verifyUsername(username))) {
            return res.status(400).son({ success: false, msg: "Bad username, contains disallowed characters!" })
        }

        const queryResult = await DB.authUsername(username);
        if (queryResult.length <= 0) {
            return res.status(404).json({ success: false, msg: "Username does not exist. Please create new account!" });    // not found
        }

        if (!(UTILS.verifyPassStrength(password))) {
            return res.status(400).json({ success: false, msg: "Bad password, check password strength!" })
        }

        const storedHashedPassword = queryResult[0].password;
        const isPasswordMatch = await UTILS.comparePassword(password, storedHashedPassword);

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, msg: "Incorrect password!" });    // unauthorized access
        }

        // TODO: set up refresh token for the JWT

        const secretKey = process.env.JWT_TOKEN_SECRET
        const expiresIn = '1h'
        const token = jwt.sign({ user: username }, secretKey, { expiresIn })

        // not a typical implementation for the server to set the headers
        // res.setHeader('Authorization', 'Bearer ' + token);

        console.log("User successfully logged in!");
        return res.status(200).json({ success: true, token: token, msg: "User is logged in!" });  // all ok
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: `Internal server error! ${err}` });     // internal server error
    }
})

users.post('/logout', (req, res) => {
    if (!(req.session.loggedIn)) {
        return res.status(200).json({ success: true, msg: "No active session found." })
    }
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Failed to log out. Please try again." });
        } else {
            return res.status(200).json({ success: true, msg: "Successfully logged out." });
        }
    });
})


// TODO: when registering, verify the user with email confirmation???
users.post('/register', async (req, res, next) => {

    // TODO: if user is already logged it, new user cannot be added, but for that sessions are needed

    try {
        const { name, surname, username, email, password, password2 } = req.body;
        // TODO: verify all user data, email, username and password are checked, repeat for name and surname to allow only characters, maybe numbers

        if (!(name && surname && username && email && password && password2)) {
            return res.status(400).json({ success: false, msg: "Input field missing! Please fill in all the fields." });
        }

        if (!(UTILS.verifyEmail(email))) {
            return res.status(400).json({ success: false, msg: "Bad email, contains disallowed characters!" })
        }
        const queryResultEmail = await DB.authEmail(email);
        if (queryResultEmail.length != 0) {
            return res.json({ success: false, msg: "User with that E-mail already exists!" });
        }

        if (!(UTILS.verifyUsername(username))) {
            return res.status(400).json({ success: false, msg: "Bad username, contains disallowed characters!" })
        }
        const queryResultUsername = await DB.authUsername(username);
        if (queryResultUsername.length > 0) {
            return res.json({ success: false, msg: "User with that Username already exists!" });
        }

        if (!(UTILS.verifyNameSurname(name, surname))) {
            return res.status(400).json({ success: false, msg: "Bad name/surname, contains disallowed characters!" })
        }

        if (password !== password2) {
            return res.status(401).json({ success: false, msg: "Passwords do not match!" });
        }
        if (!(UTILS.verifyPassStrength(password))) {
            return res.status(400).json({ success: false, msg: "Bad password, check password strength!" })
        }

        const hashedPassword = await UTILS.hashPassword(password);
        if (!hashedPassword) {
            console.log("Error hashing password!");
            return res.status(500).json({ success: false, msg: "Internal server error!" });
        }

        const queryResult = await DB.addUser(name, surname, username, email, hashedPassword);
        if (!(queryResult.affectedRows)) {
            return res.status(500).json({ success: false, msg: "Error registering new user..." });
        }

        return res.status(200).json({ success: true, msg: "New user successfully registered." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Internal server error!" });
    }
});


// Some way of logging, keeping logs of what is going on, like which user logs in registers logs out at what time etc.

module.exports = users
