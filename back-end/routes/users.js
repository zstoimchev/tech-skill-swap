const express = require("express")
const users = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10
const UTILS = require('../utils/functions.js')


users.post('/login', async (req, res, next) => {
    try {
        if (req.session.loggedIn) {
            return res.status(200).json({ success: true, msg: "User is already logged in!" });
        }

        const { username, password } = req.body;
        if (!(username && password)) {
            return res.status(400).json({ success: false, msg: "Please enter both Username & Password!" });     // bad request
        }

        // TODO: validate input before sending to DB to prevent SQL injection
        const queryResult = await DB.authUsername(username);
        if (queryResult.length <= 0) {
            return res.status(404).json({ success: false, msg: "Username does not exist. Please create new account!" });    // not found
        }

        const storedHashedPassword = queryResult[0].password;
        const isPasswordMatch = await UTILS.comparePassword(password, storedHashedPassword);

        if (!isPasswordMatch) {
            return res.status(401).json({ success: false, msg: "Incorrect password!" });    // unauthorized access
        }

        // TODO: set up JWT and refresh token instead of session authentication
        // const token = jwt.sign({username: username}, 'i-love-programming'/*, { expiresIn: 'never' }*/);

        req.session.user = queryResult[0];
        req.session.loggedIn = true;
        console.log("User successfully logged in!");
        return res.status(200).json({ success: true, msg: "User is logged in!" });  // all ok
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Internal server error!" });     // internal server error
    }
});

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

users.get('/session', async (req, res, next) => {
    try {
        res.json(req.session)
    } catch (error) {
        res.sendStatus(500)
    }
})

users.post('/register', async (req, res, next) => {
    // TODO: when registering, verify the user with email confirmation???
    try {
        // TODO: if user is already logged it, new user cannot be added, but for that sessions are needed

        const { name, surname, username, email, password, password2 } = req.body;

        if (!(name && surname && username && email && password && password2)) {
            return res.json({ success: false, msg: "Input field missing! Please fill in all the fields." });
        }

        if (password !== password2) {
            return res.json({ success: false, msg: "Passwords do not match!" });
        }

        const hashedPassword = await UTILS.hashPassword(password);
        if (!hashedPassword) {
            console.log("Error hashing password!");
            return res.status(500).json({ success: false, msg: "Internal server error!" });
        }

        // TODO: check if email is really an email, consists of username [at] provider [dot] domain

        // TODO: validate ALL user input before sending to DB to prevent SQL injection

        const queryResultUsername = await DB.authUsername(username);
        const queryResultEmail = await DB.authEmail(email);

        if (queryResultEmail.length != 0) {
            return res.json({ success: false, msg: "User with that E-mail already exists!" });
        }

        if (queryResultUsername.length > 0) {
            return res.json({ success: false, msg: "User with that Username already exists!" });
        }

        const queryResult = await DB.addUser(name, surname, username, email, hashedPassword);
        if (!(queryResult.affectedRows)) {
            return res.json({ success: false, msg: "Error registering new user..." });
        }

        return res.json({ success: true, msg: "New user successfully registered." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, msg: "Internal server error!" });
    }
});


// Some way of logging, keeping logs of what is going on, like which user logs in registers logs out at what time etc.

module.exports = users
