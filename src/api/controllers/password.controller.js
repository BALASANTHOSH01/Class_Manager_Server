const crypto = require("crypto");
const Student = require("../models/student.model.js");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");
const sendEmail = require("../services/sendEmail.js");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Generate random token
const generateToken = () => {
  const token = crypto.randomBytes(25).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour expiration
  return { token, expires };
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).send("Email and role fields are required.");
    }

    let user;
    if (role === "student") {
      user = await Student.findOne({ email });
    } else if (role === "staff") {
      user = await Staff.findOne({ email });
    } else if (role === "institute") {
      user = await Institute.findOne({ email });
    } else {
      return res.status(400).send("Invalid role.");
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const { token, expires } = generateToken();
    user.resetPassword = { token, expires };

    await user.save();

    const API_URL=process.env.API_URL;

    // Send reset email 
    const resetUrl = `${API_URL}/reset-password/${token}`;
    const subject = "Reset Your 'Class Manager' Password!";
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    ${resetUrl}
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendEmail(email, subject, message);
    res.status(200).send("Password reset link sent to email.");
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).send("Server error.");
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, role } = req.body;

    if (!token || !password || !role) {
      return res.status(400).send("Token, password, and role fields are required.");
    }

    let user;
    if (role === "student") {
      user = await Student.findOne({
        "resetPassword.token": token,
        "resetPassword.expires": { $gt: Date.now() }
      });
    } else if (role === "staff") {
      user = await Staff.findOne({
        "resetPassword.token": token,
        "resetPassword.expires": { $gt: Date.now() }
      });
    } else if (role === "institute") {
      user = await Institute.findOne({
        "resetPassword.token": token,
        "resetPassword.expires": { $gt: Date.now() }
      });
    } else {
      return res.status(400).send("Invalid role.");
    }

    if (!user) {
      return res.status(404).send("Invalid or expired token.");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPassword = undefined; // Clear reset token and expiry

    await user.save();
    res.status(200).send('Password has been reset.');
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).send("Server error.");
  }
};
