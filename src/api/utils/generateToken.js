const crypto = require("crypto");

const generateToken = () => {
  const token = crypto.randomBytes(25).toString("hex");
  const expires = Date.now() + 3600000; // 1 hour expiration
  return { token, expires };
};

module.exports = generateToken
