const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const userRouter = require("./routes/userRouter")
const swaggerUI = require('swagger-ui-express')
const swaggerSpec = require('./swagger')
require('dotenv').config()



const app = express()

// CONNECT TO DB
connectDB()


// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())



// SWAGGER DOCUMENTATION
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))

// Routes
app.use("/",userRouter)

app.listen(process.env.PORT,()=>{
    console.log("server running on port 3000")
})