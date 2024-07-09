const express = require("express")
const users = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const saltRounds = 10

users.get('/all', async (req, res, next) => {
    try {
        const q = await DB.allUsers()
        return res.json(q)
    } catch (err) {
        console.log(err)
    }
})

async function hashPassword(password) {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (err) {
        console.error(err);
        return null
    }
}

async function comparePassword(userPassword, hashedPassword) {
    try {
        return await bcrypt.compare(userPassword, hashedPassword);
    } catch (err) {
        console.error(err);
        return false;
    }
}

users.post('/login', async (req, res, next) => {
    try {
        // const tokenD = req.headers['authorization']
        // if (tokenD) {
        //     try {
        //         const tokenDecoded = jwt.verify(tokenD, 'i-love-programming');
        //         return res.json({ success: false, token: tokenD, msg: "User is already logged in!" });
        //     } catch (err) {
        //         console.error(err)
        //     }
        // }

        const username = req.body.username
        const password = req.body.password
        if (!(username && password)) {
            console.log("Please enter both Username & Password!")
            res.json({success: false, token: null, msg: "Please enter both Username & Password!"})
            return
        }

        // TODO: validate input before sending to DB to prevent SQL injection
        const queryResult = await DB.authUsername(username)
        if (queryResult <= 0) {
            console.log("Username does not exist. Please create new account!")
            res.json({success: false, token: null, msg: "Username does not exist. Please create new account!"})
            return
        }

        if (!(await comparePassword(password, queryResult.password))) {
            console.log("Incorrect password!")
            return res.json({success: false, token: null, msg: "Incorrect password!"})
        }

        const token = jwt.sign({username: username}, 'i-love-programming'/*, { expiresIn: 'never' }*/);
        res.json({success: true, token: token, msg: "User is logged in!"})
    } catch (err) {
        console.error(err)
    }

});

users.post('/register', async (req, res, next) => {
    try {
        // TODO: if user is already logged it, new user cannot be added, but for that sessions are needed

        const name = req.body.name
        const surname = req.body.surname
        const username = req.body.username
        const email = req.body.email

        if (!(name && surname && username && email && req.body.password && req.body.password2)) {
            return res.json({success: false, msg: "Input field missing! Please fill in all the fields."})
        }

        if (req.body.password !== req.body.password2) {
            return res.json({success: false, msg: "Password does not match!"})
        }
        const password = await hashPassword(req.body.password)
        if (!password) {
            console.log("Error hashing password!")
            return
        }

        // TODO: check if email is really an email, consists of username [at] provider [dot] domain

        // TODO: validate ALL user input before sending to DB to prevent SQL injection

        const queryResultUsername = await DB.authUsername(username)
        const queryResultEmail = await DB.authEmail(email)

        if (queryResultEmail.length > 0) {
            return res.json({success: false, msg: "User with that E-mail already exists!"})
        }

        if (queryResultUsername.length > 0) {
            return res.json({success: false, msg: "User with that Username already exists!"})
        }


        const queryResult = await DB.addUser(name, surname, username, email, password);
        if (!(queryResult.affectedRows)) {
            res.json({success: false, msg: "Error registering new user..."})
        }
        return res.json({success: true, msg: "New user successfully registered."})
    } catch (err) {
        console.error(err)
    }
})

// TODO: session function, to check if there exists a session

// TODO: logout funcrion, to log out already logged in user

module.exports = users
