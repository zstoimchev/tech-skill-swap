const express = require('express')
const cors = require("cors")
// const session = require('express-session')
// const cookieParser = require("cookie-parser");


// TODO: manage the packages, everything is everywhere


require('dotenv').config()
const app = express()
const port = process.env.PORT || 8127

// app.use(cookieParser());


// configurations
app.use(express.json());
// app.use(session(sess))
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],

}))


const users = require("./routes/users")
const posts = require("./routes/posts")
const reset = require("./routes/reset")
const profile = require("./routes/profile")
const category = require("./routes/category")
app.use('/users', users)
app.use('/posts', posts)
app.use('/password', reset)
app.use('/profile', profile)
app.use('/category', category)

// here most probably path needs to be initialized for the brontend build directory
// and then app uses that build directory, and sends file index.html in the root page?


// app.get("/", (req, res) => { res.send("Tech Skill-Swap - HOME page. Welcome!") })
const path = require('path')
console.log(__dirname)
app.use(express.static(path.join(__dirname, "build")))
app.use(express.static(path.join(__dirname, "uploads")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html")) 
})

app.listen(port, () => { console.log(`Server is running on port: ${port}`) })
