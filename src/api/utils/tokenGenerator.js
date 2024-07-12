const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.generateAccessToken = async(userData)=>{
    const token =await jwt.sign(userData,process.env.JWT_ACCESS_TOKEN,{expiresIn:"24h"})
}

exports.generateRefreshToken = async(userData)=>{
    const token =await jwt.sign(userData,process.env.JWT_REFRESH_TOKEN)
    return token;
}

