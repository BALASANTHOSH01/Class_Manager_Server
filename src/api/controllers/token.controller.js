const jwt = require("jsonwebtoken");
const Staff = require("../models/staff.model.js");
const Student = require("../models/student.model.js");
const Institute = require("../models/institute.model.js");

exports.refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(409).send("Token is required.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_TOKEN);

    let user;
    let newAccessToken;

    if (decoded.staff_id) {
      user = await Staff.findById(decoded.staff_id);
      newAccessToken = jwt.sign({ staff_id: decoded.staff_id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
    } else if (decoded.institute_id) {
      user = await Institute.findById(decoded.institute_id);
      newAccessToken = jwt.sign({ institute_id: decoded.institute_id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
    } else if (decoded.student_id) {
      user = await Student.findById(decoded.student_id);
      newAccessToken = jwt.sign({ student_id: decoded.student_id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: '1h' });
    } else {
      return res.status(404).send("User not found.");
    }

    if (!user) {
      return res.status(404).send("User not found.");
    }

    res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Error refreshing token:", error.message);
    return res.status(403).send("Invalid refresh token.");
  }
};
