const express = require("express")
const users = express.Router();
const DB = require('../db/dbConn.js')

// log in user
users.post('/login', async (req, res, next) => {
    try {
        console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
            const queryResult = await DB.AuthUser(username)
            if (queryResult.length > 0) {
                if (password === queryResult[0].password) {
                    req.session.user = queryResult
                    req.session.logged_in = true
                    res.statusCode = 200;
                    res.json({ user: queryResult[0], status: { success: true, msg: "Logged in" } })
                } else {
                    res.statusCode = 200;
                    res.json({ user: null, status: { success: false, msg: "Username or password incorrect" } })
                    console.log("INCORRECT PASSWORD")
                }
            } else {
                res.statusCode = 200;
                res.send({ user: null, status: { success: false, msg: "Username not registsred" } })
            }
        }
        else {
            res.statusCode = 200;
            res.send({ logged: false, user: null, status: { success: false, msg: "Input element missing" } })
            console.log("Please enter Username and Password!")
        }
        res.end();
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
        next()
    }
});

// inserts new user into the DB
users.post('/register', async (req, res, next) => {
    try {
        const name = req.body.name
        const surname = req.body.surname
        const email = req.body.email
        const username = req.body.username
        const password = req.body.password
        // TODO: Add validation, check if user already exists
        if (name && surname && email && username && password) {
            const queryResult = await DB.addUser(name, surname, email, username, password);
            if (queryResult.affectedRows) {
                res.statusCode = 200;
                res.send({ status: { success: true, msg: "New user created" } })
                console.log("New user added!!")
            }
        }
        else {
            res.statusCode = 200;
            res.send({ status: { success: false, msg: "Input element missing" } })
            console.log("A field is missing!")
        }
        res.end();
    } catch (err) {
        console.log(err)
        res.statusCode = 500;
        res.send({ status: { success: false, msg: err } })
        next()
    }

});

// fetch all users from the DB
users.get('/all', async (req, res, next) => {
    try {
        const queryResult = await DB.allUsers(req.params.id)
        res.json(queryResult)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
        next()
    }
})

// check session
users.get('/session', async (req, res, next) => {
    try {
        res.json(req.session)
    } catch (error) {
        res.sendStatus(500)
    }
})

// log out user, function to log out the user and destroy the session
users.get('/logout', async (req, res, next) => {
    try {
        req.session.destroy(() => {
            console.log("User logged out")
            res.json(req.session)
            //res.redirect('/users/login')
        })
    } catch (error) {
        res.sendStatus(500)
    }
})

module.exports = users
