const User = require("../model/userModel")

const greet = async (req, res) => {
  try {
    res.status(200).send("helooo");
  } catch (error) {}
};

const userSignup = async (req, res) => {
  try {
    const {name, email, password} = req.body
    const newUser = {
        name,
        email,
        password
    }
    const user = await User(newUser)
    user.save()
    
    res.status(200).json({message:"User signup successfully"})
 } catch (error) {
    console.error(error);
  }
};

module.exports = { userSignup, greet };
