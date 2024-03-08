const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log('Connection established');
})


let dataPool = {}

dataPool.allNovice = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM news`, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

dataPool.oneNovica = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM news WHERE id = ?`, id, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

dataPool.creteNovica = (title, slug, text, file) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO news (title,slug,text, file) VALUES (?,?,?,?)`, [title, slug, text, file], (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}




// =========================================USER QUERIES ==========================================
dataPool.AuthUser = (username) => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User WHERE username = ?', username, (err, res, fields) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })

}

dataPool.addUser = (name, surname, email, username, password) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO User (name,surname,email,username,password) VALUES (?,?,?,?,?)`, [name, surname, email, username, password], (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

// fetch all users from the DB
dataPool.allUsers = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM User`, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}
// =================================================================================================




// ========================================= POSTS QUERIES =========================================
// get all posts from the DB
dataPool.allPosts = () => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Post`, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

// get specifis post from the DB
dataPool.onePost = (id) => {
  return new Promise((resolve, reject) => {
    conn.query(`SELECT * FROM Post WHERE id = ?`, id, (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}

// insert one post to the DB
dataPool.cretePost = (userid, title, body, image) => {
  return new Promise((resolve, reject) => {
    conn.query(`INSERT INTO Post (user_id,title,body,Image) VALUES (?,?,?,?)`, [userid, title, body, image], (err, res) => {
      if (err) { return reject(err) }
      return resolve(res)
    })
  })
}
// =================================================================================================
module.exports = dataPool;
