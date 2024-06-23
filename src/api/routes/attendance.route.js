const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/attendance.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");
const role = require("../middlewares/role.middleware.js");

// Attendance routes
router.patch("/:date/:rollno",Authorization,role.allowedRole("institute","staff"), Attendance.updateAttendance); // update attendance
router.patch("/update",Authorization,role.allowedRole("institute","staff"), Attendance.updateManyAttendance); // update many attendance
router.post("/takeone",Authorization,role.allowedRole("institute","staff"), Attendance.takeOneAttendance); // take attendance
router.post("/takemany",Authorization,role.allowedRole("institute","staff"), Attendance.takeManyAttendance); // take many attendance
router.get("/:department/:year/:date",Authorization,role.allowedRole("institute","staff"), Attendance.getAttendanceByDeptYearandDate); // get attendance by dept, year and date
router.get("/self/:rollno",Authorization,role.allowedRole("student"), Attendance.getOwnAttendanceByRollno); // get own attendance by rollno
router.get("/:rollno",Authorization,role.allowedRole("institute","staff","student"), Attendance.getAttendanceByRollno); // get own attendance by rollno
router.get("/date/:date",Authorization,role.allowedRole("institute","staff"), Attendance.getAttendanceByDate); // get attendance by rollno
router.get("/:department/:year",Authorization,role.allowedRole("institute","staff"), Attendance.getAttendanceByDeptandYear); // get attendance by date

module.exports = router;
