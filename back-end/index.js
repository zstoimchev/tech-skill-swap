const express = require('express')
const cors = require("cors")
// const session = require('express-session')
// const cookieParser = require("cookie-parser");

require('dotenv').config()
const app = express()
const port = process.env.PORT || 8127


// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    methods: ["GET", "POST"],
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3001']
}))

app.get("/", (req, res) => {
    res.send("hola")
})

const posts = require("./routes/posts")
const users = require("./routes/users")
app.use('/posts', posts)
app.use('/users', users)

///App listening on port
app.listen(process.env.PORT || port, () => {
    console.log(`Server is running on port: ${process.env.PORT || port}`)
})
