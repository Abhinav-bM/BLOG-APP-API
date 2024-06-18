const User = require("../model/userModel");
const Blog = require("../model/blogModel");
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

    if (existingUser) {
      res.status(409).json({ error: "Email already exists" });
    }

    const newUser = {
      name,
      email,
      password,
    };

    const user = await User(newUser);
    user.save();

    const accessToken = jwt.sign({ user }, process.env.jwtSecret, {
      expiresIn: "15s",
    });
    const refreshToken = jwt.sign({ user }, process.env.jwtSecret, {
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

    if (user.password === password) {
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
    console.error(err.message);
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
const editComment = async () =>{
  try {
    const {comment} = req.body
    const blog = await Blog.findById({_id:req.params.blogId})

    if(!blog){
      res.status(404).json({message : "Blog not found"})
    }

    const existingComment = blog.comments.find(comment => comment._id === req.params.commentId)
    if(!existingComment){
      res.status(404).json({message : "Comment not found"})
    }

    if(existingComment.user !== req.user._id){
      res.status(404).json({message : 'User not authorized'})
    }

    existingComment.text = comment
    await blog.save()
    res.status(200).json({message : "Comment edited successfully"})
  } catch (error) {
    console.error(error)
    res.status(500).json({error: "Internal server error"})
  }
}

module.exports = {
  userSignup,
  userLogin,
  createBlog,
  updateBlog,
  deleteBlog,
  addComment,
  editComment,
};
