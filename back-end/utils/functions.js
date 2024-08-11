const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const util = require('util')
const jwtVerify = util.promisify(jwt.verify)


let funct = {}

funct.hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds)
    } catch (err) {
        console.error(err)
        return null
    }
}

funct.comparePassword = async function (userPassword, hashedPassword) {
    try {
        return await bcrypt.compare(userPassword, hashedPassword)
    } catch (err) {
        console.error(err)
        return false
    }
}

funct.verifyEmail = function (email) {
    // TODO: using regex verify if the email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

funct.verifyPassStrength = function (pass) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(pass)

}

funct.verifyUsername = function (username) {
    const regex = /^[a-zA-Z0-9._-]{4,16}$/
    return regex.test(username)
}

funct.verifyNameSurname = function (name, surname) {
    const regex = /^[a-zA-Z0-9-']{4,16}$/
    return regex.test(name) && regex.test(surname)
}

funct.verifyId = function (id) {
    const regex = /^[0-9]+$/
    return regex.test(id)
}

funct.verifyRole = function (role) {
    return role === "Helper" || role === "Seeker" || role === "both"
}

funct.authorizeLogin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401).json({ success: false, msg: "No JWT token found. Please log in first!" })
    }

    try {
        const user = await jwtVerify(token, process.env.JWT_TOKEN_SECRET)
        req.user = user.user
        next()
    } catch (err) {
        return res.status(403).json({ success: false, msg: "JWT token expired! Please log in again." })
    }
}

funct.authorizeLoginForLogin = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) {
        return next()
    }

    try {
        const user = await jwtVerify(token, process.env.JWT_TOKEN_SECRET)
        return res.status(200).json({ success: true, msg: "User is already logged in!" })
    } catch (err) {
        next()
    }
}

funct.verifyCategoryNumber = function (p) {
    const regex = /^[0-9]+$/
    return regex.test(p)
}

module.exports = funct