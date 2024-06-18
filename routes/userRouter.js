const express = require("express");
const userController = require("../controller/userController");
const { authenticate } = require("../middleware/jwt");
const upload = require("../config/multer")

const router = express.Router();

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.post("/createBlog", authenticate, upload.array('image'), userController.createBlog)
router.post("/addComment/:id",authenticate, userController.addComment)

router.put("/updateBlog/:id",authenticate, upload.array('image'), userController.updateBlog)
router.put("/editComment/:blogId/:commentId", authenticate,userController.editComment)

router.delete("/deleteBlog/:id", authenticate, userController.deleteBlog)

module.exports = router;