const express = require("express")
const userController = require("../controller/userController")
const bodyParser =  require("body-parser")
const cookieParser = require("cookie-parser")

const router = express.Router()

// MIDDLEWARES

router.get("/",userController.greet)

router.post("/signup",userController.userSignup)


module.exports = router