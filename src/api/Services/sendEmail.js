require("dotenv").config();
const nodemailer = require("nodemailer");

const sendNotification = async (to, subject, message) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email_ID,
      pass: process.env.Email_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.Email_ID,
    to,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = sendNotification;
