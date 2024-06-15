const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const userRouter = require("./routes/userRouter")
require('dotenv').config()



const app = express()

// CONNECT TO DB
connectDB()


// MIDDLEWARES
app.use(bodyParser.json())
app.use(cookieParser())


// Routes
app.use("/",userRouter)

app.listen(process.env.PORT,()=>{
    console.log("server running on port 3000")
})