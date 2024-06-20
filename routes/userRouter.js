const express = require("express");
const userController = require("../controller/userController");
const { authenticate } = require("../middleware/jwt");
const upload = require("../config/multer")

const router = express.Router();


router.get("/getAllBlogs",authenticate, userController.getAllBlogs)
router.get("/getFollowers", authenticate, userController.getFollowers)
router.get("/getFollowing", authenticate, userController.getFollowing)

router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.post("/logout", authenticate, userController.userLogout)
router.post("/createBlog", authenticate, upload.array('image'), userController.createBlog)
router.post("/addComment/:id",authenticate, userController.addComment)
router.post("/addReview/:blogId", authenticate, userController.addReview)
router.post("/follow/Unfollow/:id",authenticate, userController.followUnfollowUser)

router.put("/updateBlog/:id",authenticate, upload.array('image'), userController.updateBlog)
router.put("/editComment/:blogId/:commentId", authenticate,userController.editComment)
router.put("/editReview/:blogId/:reviewId", authenticate, userController.editReview)

router.delete("/deleteBlog/:id", authenticate, userController.deleteBlog)
router.delete("/deleteComment/:blogId/:commentId", authenticate, userController.deleteComment)
router.delete("/deleteReview/:blogId/:reviewId", authenticate, userController.deleteReview)

module.exports = router;