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
    // TODO: implement a function that checks if given password is of the required length, contains special chars, caps, unmbers, etc.
    // minimum 8 characters, I want it to be secure.
    if (pass.length < 8)
        return false;
    
}

funct.verifyUsername = function(username) {
    const regex = /^[a-zA-Z0-9_-]{4,16}$/
    return regex.test(username)
}

module.exports = funct
