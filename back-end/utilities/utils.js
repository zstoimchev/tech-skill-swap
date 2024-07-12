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
}

module.exports = funct
