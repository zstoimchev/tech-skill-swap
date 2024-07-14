const express = require('express')
const cors = require("cors")
const session = require('express-session')
const cookieParser = require("cookie-parser");


// TODO: manage the packages, everything is everywhere


require('dotenv').config()
const app = express()
const port = process.env.PORT || 8127

app.use(cookieParser());

let sess = {
    secret: 'our litle secrett',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        sameSite: 'none',
        httpOnly: true
    },
    name: "app",
    sameSite: 'none',
    //     proxy: true,

}

// configurations
app.use(express.json());
app.use(session(sess))
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    methods: ["GET", "POST"],
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001'],

}))


const users = require("./routes/users")
const posts = require("./routes/posts")
const reset = require("./routes/reset")
app.use('/users', users)
app.use('/posts', posts)
app.use('/password', reset)

// here most probably path needs to be initialized for the brontend build directory
// and then app uses that build directory, and sends file index.html in the root page?


app.get("/", (req, res) => { res.send("Tech Skill-Swap - HOME page. Welcome!") })

app.listen(port, () => { console.log(`Server is running on port: ${port}`) })
