const crypt = require("crypto");
const Student = require("../models/student.model.js");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");
const sendEmail = require("../Services/sendEmail.js");
const bcrypt = require("bcrypt");

//generate random token
const generatedToken = () => {
  const token = crypt.randomBytes(25).toString("hex");
  const expires = Date.now() + 3600000;
  return { token, expires };
};

//forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(409).send("email and role fields are must.");
    }

    let user;
    if (role === "student") {
      user = await Student.findOne({ email: email });
    } else if (role === "staff") {
      user = await Staff.findOne({ email: email });
    } else if (role === "institute") {
      user = await Institute.findOne({ email: email });
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const { token, expires } = generatedToken();
    user.resetPassword = { token, expires }; 

    user.save();

    // Send reset email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${token}`;
    const subject = "Reset Your 'Class Manager' Password!";
    const message = `You are receiving this because you (or someone else) have requested the reset of the password for your account.
    Please click on the following link, or paste this into your browser to complete the process:
    ${resetUrl}
    If you did not request this, please ignore this email and your password will remain unchanged.`;

    await sendEmail(email, subject, message);
    res.status(200).send("Password reset link send to email.");
  } catch (error) {
    return res.status(505).send("server error");
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, role } = req.body;

    let user;
    if (role === "student") {
      user = await Student.findOne({
        resetPassword: { token: token, expires: { $gt: Date.now() } },
      });
    } else if (role === "staff") {
      user = await Staff.findOne({
        resetPassword: { token: token, expires: { $gt: Date.now() } },
      });
    } else if (role === "institute") {
      user = await Institute.findOne({
        resetPassword: { token: token, expires: { $gt: Date.now() } },
      });
    }

    if(!user){
        return res.status(404).send("");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPassword.token = undefined;
    user.resetPassword.expires = undefined;

    await user.save();
    res.status(200).send('Password has been reset');
  } catch (error) {
    return res.status(505).send("server error");
  }
};
