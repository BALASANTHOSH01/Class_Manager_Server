const mongoose = require("mongoose");
require("dotenv").config();

const DB_URI = process.env.DB_URI;

const connectDB = async () => {
  try {
    
    await mongoose.connect(DB_URI).then(() => {
      console.log("DB Connected successfully.");
    });

  } catch (error) {
    console.log("Error in DB connection " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
