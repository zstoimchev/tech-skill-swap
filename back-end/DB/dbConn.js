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
        console.log("ERROR: " + err.message)
        return
    }
    console.log('Connection with the DB established')
})

let dataPool = {}


dataPool.authUsername = (username) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User WHERE username = ?', [username], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.authUsernameWithRole = (username) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                User.id AS id, 
                User.name, 
                User.surname, 
                User.email, 
                User.username, 
                Seeker.interests AS interests, 
                COALESCE(Seeker.about, Helper.about) AS about,
                Helper.skills AS skills 
            FROM User 
            LEFT JOIN Seeker ON User.id = Seeker.user_id
            LEFT JOIN Helper ON User.id = Helper.user_id 
            WHERE User.username = ?`

        conn.query(query, [username], (err, res, fields) => {
            if (err) {
                return reject(err)
            }
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

dataPool.getIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id FROM User WHERE email = ?', email, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getIdByUsername = (username) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT id FROM User WHERE username = ?', username, (err, res, fields) => {
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
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.changePass = async (pw, email) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE User SET password = ? WHERE email = ?`,
            [pw, email],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.changeName = async (name, surname, username) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE User SET name = ?, surname = ? WHERE username = ?`,
            [name, surname, username],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.changeEmail = async (email, username) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE User SET email = ? WHERE username = ?`,
            [email, username],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.changeUsername = async (username, user) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE User SET username = ? WHERE username = ?`,
            [username, user],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.updateHelperAbout = async (about, userId) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Helper SET about = ? WHERE user_id = ?`,
            [about, userId],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.updateSeekerAbout = async (about, userId) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Seeker SET about = ? WHERE user_id = ?`,
            [about, userId],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.updateSkills = async (skills, userId) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Helper SET skills = ? WHERE user_id = ?`,
            [skills, userId],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}

dataPool.updateInterests = async (interests, userId) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Seeker SET interests = ? WHERE user_id = ?`,
            [interests, userId],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    }).catch(err => console.log(err))
}



dataPool.allPosts = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Post', (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.allPostsJ = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT Post.*, User.name, User.surname, Category.name as category_name
            FROM Post
            JOIN Category ON Post.category = Category.id
            JOIN User ON Post.user_id = User.id
        `
        conn.query(query, (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.getAllPostsByUserId = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Post WHERE user_id = ? ORDER BY created_at DESC', id, (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}


dataPool.onePost = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT Post.*, User.name, User.surname, User.email, User.username, Category.name AS category_name 
                    FROM Post 
                    JOIN Category ON Post.category = Category.id 
                    JOIN User ON Post.user_id = User.id 
                    WHERE Post.id = ?`, id, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.addPost = (title, body, img, user_id, category_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Post (title,body,image,user_id,category) VALUES (?,?,?,?,?)`,
            [title, body, img, user_id, category_id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.editPost = (title, body, img, user_id, category_id, old_post_id) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Post
                    SET title = ?,
                    body = ?,
                    image = ?,
                    user_id = ?,
                    category = ?
                    WHERE id = ?`,
            [title, body, img, user_id, category_id, old_post_id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}



dataPool.searchPosts = (payload) => {
    return new Promise((resolve, reject) => {
        const query = `
                SELECT Post.*, User.name, User.surname, Category.name as category_name
                FROM Post
                JOIN User ON Post.user_id = User.id
                JOIN Category on Category.id = Post.category
                WHERE Post.title LIKE ? OR Post.body LIKE ?
            `
        conn.query(query, ['%' + payload + '%', '%' + payload + '%'], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}


// dataPool.allPostsJ = () => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             SELECT Post.*, User.name, User.surname
//             FROM Post
//             JOIN User ON Post.user_id = User.id
//         `
//         conn.query(query, (err, res) => {
//             if (err) { return reject(err) }
//             return resolve(res)
//         })
//     })
// }



dataPool.addRole = (table, id) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO ${table} (user_id) VALUES (?)`,
            [id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.addRoleDataSeeker = (id, interests, about) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Seeker SET interests = ?, about = ? WHERE user_id = ?`,
            [interests, about, id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.addRoleDataHelper = (id, skills, about) => {
    return new Promise((resolve, reject) => {
        conn.query(`UPDATE Helper SET skills = ?, about = ? WHERE user_id = ?`,
            [skills, about, id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.removeHelper = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Helper WHERE user_id = ?`, [id], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}

dataPool.removeSeeker = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`DELETE FROM Seeker WHERE user_id = ?`, [id], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}

dataPool.addHelperRole = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Helper (user_id) VALUES (?)`, [id], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}

dataPool.addSeekerRole = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`INSERT INTO Seeker (user_id) VALUES (?)`, [id], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}

dataPool.authRole = (table, id) => {
    return new Promise((resolve, reject) => {
        conn.query(`SELECT * FROM ${table} WHERE user_id = ?`, [id], (err, res) => {
            if (err) {
                return reject(err)
            }
            return resolve(res)
        })
    })
}


dataPool.addComment = (user_id, post_id, content) => {
    return new Promise((resolve, reject) => {
        conn.query('Insert into Comment (user_id, post_id, content) VALUES (?,?,?)',
            [user_id, post_id, content],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.getCommentsByPostId = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT Comment.*, User.username FROM Comment JOIN User ON Comment.user_id = User.id WHERE Comment.post_id = ? ORDER BY Comment.date ASC', id, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.deletePost = (id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Post WHERE id = ?', [id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.fetchCategories = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Category', (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.authCategory = (name) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Category WHERE name = ?', [name], (err, res) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

dataPool.addCategory = (name) => {
    return new Promise((resolve, reject) => {
        conn.query('Insert into Category (name) VALUES (?)',
            [name],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.fetchPostsByGivenCategory = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`
                SELECT Post.*, User.name, User.surname, Category.name as category_name
                FROM Post
                JOIN User ON Post.user_id = User.id
                JOIN Category ON Post.category = Category.id
                WHERE Category.id = ?
            `,
            [id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.findUserByPostId = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`
                SELECT User.email, Post.title
                FROM Post
                JOIN User ON Post.user_id = User.id
                WHERE Post.id = ?
            `,
            [id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

dataPool.fetchCommentsFromPerson = (id) => {
    return new Promise((resolve, reject) => {
        conn.query(`
                SELECT Comment.*, Post.id, Post.title
                FROM Comment
                JOIN Post ON Post.id = Comment.post_id
                WHERE Comment.user_id = ?
                ORDER BY Comment.date
            `,
            [id],
            (err, res) => {
                if (err) { return reject(err) }
                return resolve(res)
            })
    })
}

module.exports = dataPool