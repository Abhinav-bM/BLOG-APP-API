const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async (req, res) => {
  try {
    await mongoose.connect(process.env.mongoDB);
    console.log("connected to database")
  } catch (error) {
    console.error('Error connecting to mongodb :', error)
    process.exit(1)
  }
};

module.exports = connectDB