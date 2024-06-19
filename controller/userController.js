const User = require("../model/userModel");
const Blog = require("../model/blogModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cloudinary = require("../config/cloudinary");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const jwtSecret = process.env.jwt_secret;

// USER SIGNUP
const userSignup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    const bcryptedPass = await bcrypt.hash(password, 10);

    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
    }

    const newUser = {
      name,
      email,
      password: bcryptedPass,
    };

    const user = await User(newUser);
    user.save();

    const accessToken = jwt.sign({ user }, jwtSecret, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign({ user }, jwtSecret, {
      expiresIn: "1d",
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken)
      .status(201)
      .json({ message: "user signup successfully" });
  } catch (error) {
    console.error(error);
  }
};

// USER LOGIN
let userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (validPassword) {
      const accessToken = jwt.sign({ user }, jwtSecret, {
        expiresIn: "15s",
      });
      const refreshToken = jwt.sign({ user }, jwtSecret, {
        expiresIn: "1d",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .cookie("accessToken", accessToken)
        .status(200)
        .json({ message: "Logged in successfully" });
    } else {
      res.status(404).json({ error: "Incorrect password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// USER LOGOUT
const userLogout = (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(401).send("Unauthorized");
  }
  res
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .status(200)
    .send("Logged out successfully");
};

// CREATE NEW BLOG
const createBlog = async (req, res) => {
  const { title, content } = req.body;
  let imageData = req.files;
  console.log("title content :", title, content);
  console.log("imgae data :", imageData);

  let imageUrl = "";

  try {
    if (imageData.length > 0) {
      const result = await cloudinary.uploader.upload(imageData[0].path);
      imageUrl = result.secure_url;
    } else {
      console.log("No image data found");
    }

    const blog = new Blog({
      title,
      content,
      images: [imageUrl],
      author: req.user._id,
    });

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE BLOG
const updateBlog = async (req, res) => {
  const { title, content } = req.body;
  let imageData = req.files;
  console.log("title content :", title, content);
  console.log("imgae data :", imageData);
  console.log("blog id : ", req.params.id);

  let imageUrl = "";

  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
    }
    if (imageData.length > 0) {
      const result = await cloudinary.uploader.upload(imageData[0].path);
      imageUrl = result.secure_url;
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.images = [imageUrl] || blog.images;

    await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// DELETE BLOG
const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    await Blog.deleteOne({ _id: req.params.id });
    res.status(500).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the blog" });
  }
};

// GET ALL BLOGS
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    console.log(comment);
    const blog = await Blog.findById({ _id: req.params.id });

    if (!blog) {
      res.status(404).json({ msg: "Blog not found" });
    }

    if (comment) {
      const newComment = { user: req.user._id, text: comment };
      blog.comments.unshift(newComment);
      await blog.save();
      res.status(200).json({ message: "Comment added successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// EDIT COMMENT
const editComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const blog = await Blog.findById({ _id: req.params.blogId });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
    }

    const existingComment = blog.comments.find(
      (comment) => comment._id.toString() === req.params.commentId
    );
    if (!existingComment) {
      res.status(404).json({ message: "Comment not found" });
    }

    console.log("existing comment ; ", existingComment);

    if (existingComment.user.toString() !== req.user._id) {
      res.status(404).json({ message: "User not authorized" });
    }

    existingComment.text = comment;
    await blog.save();
    res.status(200).json({ message: "Comment edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById({ _id: req.params.blogId });

    if (!blog) {
      res.status(404).json({ message: "blog not found" });
    }

    const commentIndex = blog.comments.findIndex(
      (comment) => comment._id.toString() === req.params.commentId
    );

    if (commentIndex === -1) {
      res.status(404).json({ message: "comment not found" });
    }

    blog.comments.splice(commentIndex, 1);
    await blog.save();
    res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ADD REVIEW
const addReview = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const review = {
      user: req.user._id,
      rating: req.body.rating,
      content: req.body.content,
    };
    blog.reviews.push(review);
    await blog.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the review" });
  }
};

// EDIT REVIEW
const editReview = async (req, res) => {
  const { rating, content } = req.body;
  try {
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const review = blog.reviews.find(
      (review) => review.id === req.params.reviewId
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    review.rating = rating;
    review.content = content;
    await blog.save();
    res.status(200).json({ message: "review edited successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const blog = await Blog.findById({ _id: req.params.blogId });

    if (!blog) {
      res.status(404).json({ message: "Blog not found" });
    }

    const review = blog.reviews.find(
      (review) => review._id.toString() === req.params.reviewId
    );

    if (!review) {
      res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id) {
      res.status(401).json({ message: "User not authorized" });
    }

    blog.reviews = blog.reviews.filter(
      (review) => review._id.toString() !== req.params.reviewId
    );

    await blog.save();
    res.status(200).json({ message: "revew deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "internal server error" });
  }
};

// FOLLOW USER
const followUnfollowUser = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.user._id });
    const targetUser = await User.findById({ _id: req.params.id });

    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.following.includes(req.params.id)) {
      // UNFOLLOW
      user.following = user.following.filter(
        (followingId) => followingId.toString() !== req.params.id
      );
      targetUser.followers = targetUser.followers.filter(
        (followerId) => followerId.toString() !== req.user._id
      );
      await user.save();
      await targetUser.save();
      return res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // FOLLOW
      user.following.push(req.params.id);
      targetUser.followers.push(req.user._id);
      await user.save();
      await targetUser.save();
      return res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// GET FOLLOWERS
const getFollowers = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const followers = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$followers" },
      {
        $lookup: {
          from: "users",
          localField: "followers",
          foreignField: "_id",
          as: "result",
        },
      },
      { $project: { _id: 0, name: 1 } },
    ]);
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET FOLLOWING
const getFollowing = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const followers = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$following" },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "result",
        },
      },
      { $project: { _id: 0, name: 1 } },
    ]);
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  userSignup,
  userLogin,
  userLogout,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  addComment,
  editComment,
  deleteComment,
  addReview,
  editReview,
  deleteReview,
  followUnfollowUser,
  getFollowers,
  getFollowing,
};
