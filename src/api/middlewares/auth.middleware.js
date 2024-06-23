const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model.js");
const Institute = require("../models/institute.model.js");
const Student = require("../models/student.model.js");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);

    let user;
    let InstituteId;

    if (decoded.staff_id) {
      user = await Staff.findOne({ _id: decoded.staff_id });
      InstituteId = user.institute;
    } else if (decoded.institute_id) {
      user = await Institute.findById({ _id: decoded.institute_id });
      InstituteId = user.id;
    } else if (decoded.student_id) {
      user = await Student.findById(decoded.student_id);
      InstituteId = user.institute;
    }

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    req.instituteId = InstituteId;
    req.user.role = decoded.role;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).json({ error: "Please authenticate" });
  }
};

module.exports = auth;
