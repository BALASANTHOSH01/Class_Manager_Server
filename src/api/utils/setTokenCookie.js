require("dotenv").config();

const setTokenCookie = (res, name, token) => {
  const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  res.cookie(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'Strict',
    maxAge: oneDay // Set cookie expiration to match the token expiration
  });
};