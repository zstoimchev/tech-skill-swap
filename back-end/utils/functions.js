const bcrypt = require('bcrypt')
const saltRounds = 10

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

funct.verifyPassStrength = function(pass) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(pass)
    
}

funct.verifyUsername = function(username) {
    const regex = /^[a-zA-Z0-9._-]{4,16}$/
    return regex.test(username)
}

funct.verifyNameSurname = function(name, surname) {
    const regex = /^[a-zA-Z0-9-']{4,16}$/
    return regex.test(name) && regex.test(surname)
}

module.exports = funct
