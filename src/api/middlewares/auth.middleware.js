const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    let user;
    let role;
    let instituteId; // Declare instituteId variable

    if (decoded.staff_id) {
      user = await Staff.findOne({ _id: decoded.staff_id }).populate(
        "institute"
      );
      role = "staff";
      instituteId = user.institute._id;
    } else if (decoded.institute_id) {
      user = await Institute.findOne({ _id: decoded.institute_id });
      role = "institute";
      instituteId = user._id;
    }

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.instituteId = instituteId;
    req.user.role = role;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
