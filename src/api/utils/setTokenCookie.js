require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

const setTokenCookie = (res, tokenName, token, options = {}) => {
  res.cookie(tokenName, token, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: "Strict", // Protect against CSRF
    ...options,
  });
};

module.exports = setTokenCookie;
