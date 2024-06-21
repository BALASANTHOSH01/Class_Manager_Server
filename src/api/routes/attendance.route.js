const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/demo.attendance.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");

// Attendance routes
router.patch("/:date/:rollno",Authorization, Attendance.updateAttendance); // update attendance
router.patch("/update",Authorization, Attendance.updateManyAttendance); // update many attendance
router.post("/takeone",Authorization, Attendance.takeOneAttendance); // take attendance
router.post("/takemany",Authorization, Attendance.takeManyAttendance); // take many attendance
router.get("/:department/:year/:date",Authorization, Attendance.getAttendanceByDeptYearandDate); // get attendance by date
router.get("/:rollno",Authorization, Attendance.getAttendanceByRollno); // get attendance by rollno
router.get("/date/:date",Authorization, Attendance.getAttendanceByDate); // get attendance by rollno
router.get("/:department/:year",Authorization, Attendance.getAttendanceByDeptandYear); // get attendance by date

module.exports = router;
