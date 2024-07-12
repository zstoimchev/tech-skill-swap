const express = require('express')
const mysql = require('mysql')
const { resolve } = require('path')

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

conn.connect((err) => {
    if (err) {
        console.log("ERROR: " + err.message);
        return;
    }
    console.log('Connection with the DB established');
})

let dataPool = {}


dataPool.authUsername = (username) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User WHERE username = ?', username, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.authEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User WHERE email = ?', email, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.addUser = (name, surname, username, email, password) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO User (name,surname, username,email,password) VALUES (?,?,?,?,?)`,
            [name, surname, username, email, password],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.allUsers = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User', (err, res) => {
            if (err) { return reject(err); }
            return resolve(res);
        })
    })
}

// dataPool.changePass = (pw, email) => {
//     return new Promise((resolve, reject) => {
//         conn.query(`UPDATE User SET password = ? WHERE email = ?`,
//             [pw, email],
//             (err, res) => {
//                 if (err) { return reject(err) }
//                 return resolve(res)
//             })
//     })
// }

dataPool.changePass = async (pw, email) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE User SET password = ? WHERE email = ?`,
            [pw, email],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err)) // Log any errors
}




// dataPool.changePass = async (pw, email) => {
//     return new Promise((resolve, reject) => {
//         // first get the current password
//         conn.query(`SELECT password FROM User WHERE email = ?`, [email], async (err, res) => {
//             if (err) { return reject(err) }

//             const currentPassword = res[0].password;

//             // now update the password
//             conn.query(`UPDATE User SET password = ? WHERE email = ?`, [pw, email], (err, res) => {
//                 if (err) { return reject(err) }
//                 // check if the password is changed
//                 if (pw !== currentPassword) {
//                     res.passwordChanged = true;
//                 } else {
//                     res.passwordChanged = false;
//                 }
//                 return resolve(res)
//             })
//         })
//     })
// }



module.exports = dataPool;
