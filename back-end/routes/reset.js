const express = require("express")
const reset = express.Router()
const DB = require('../DB/dbConn.js')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const UTILS = require('../utils/functions.js')
require('dotenv').config()

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

reset.post('/reset', async (req, res) => {
    // TODO: if the user is logged in, check existing password and prompt for new one

    const email = req.body.email

    // TODO: check if the email is really an email & prevent SQL injection

    const user = await DB.authEmail(email)
    if (user.length != 1) {
        return res.status(404).json({ success: false, msg: "No such user found!" })
    }

    const secretKey = process.env.JWT_SECRET
    const expiresIn = '1h'
    const token = jwt.sign({ email: email }, secretKey, { expiresIn })

    let mailOptions = {
        from: process.env.MY_EMAIL,
        to: email,
        subject: 'Password Reset - Tech Skill-Swap',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
               http://localhost:3000/reset/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`
    }

    transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
            return res.status(500).json({ success: false, msg: "Error sending mail to the user." })    // internal server error
        } else {
            return res.status(200).json({ success: true, msg: "Recovery email sent!" })     // everything is ok
        }
    })
})

reset.get('/reset/:token', async (req, res) => {
    if (!req.params.token) {
        return res.json({ success: false, msg: "No password-reset token provided!" })
    }

    const token = req.params.token
    const secretKey = process.env.JWT_SECRET

    try {
        const decoded = jwt.verify(token, secretKey)
        const email = decoded.email

        const user = await DB.authEmail(email)
        if (!user || user.length != 1) {
            return res.status(404).json({ success: false, msg: "No such user found!" })
        }
        return res.status(200).json({ success: true, msg: "User found! Proceed to password reset." })
    } catch (err) {
        return res.status(401).json({ success: false, msg: "Invalid or expired token!" })
    }
})

reset.post('/reset/:token', async (req, res) => {
    if (!req.params.token) {
        return res.json({ success: false, msg: "No password-reset token provided!" })
    }

    const token = req.params.token
    const secretKey = process.env.JWT_SECRET

    try {
        const decoded = jwt.verify(token, secretKey)
        const email = decoded.email

        const { pw1, pw2 } = req.body
        if (pw1 !== pw2) {
            return res.status(401).json({ success: false, msg: "Passwords do not match!" })
        }

        const hashedPassword = await UTILS.hashPassword(pw1)
        const queryResult = await DB.changePass(hashedPassword, email)

        if (!(queryResult.affectedRows)) {
            return res.status(500).json({ success: false, msg: "No password was changed." })
        }

        return res.status(200).json({ success: true, msg: "Password successfully changed!" })
    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, msg: "Error processing the token!" })
    }
})

module.exports = reset
