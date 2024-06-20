const express = require("express");
const router = express.Router();
const Attendance = require("../controllers/demo.attendance.controller.js");

// Attendance routes
router.patch("/:date/:rollno",Attendance.updateAttendance); // update attendance
router.patch("/update",Attendance.updateManyAttendance); // update many attendance
router.post("/",Attendance.takeOneAttendance); // take attendance
router.post("/many",Attendance.takeManyAttendance); // take many attendance
router.get("/:department/:year/:date",Attendance.getAttendanceByDeptYearandDate); // get attendance by date
router.get("/:rollno",Attendance.getAttendanceByRollno); // get attendance by rollno
router.get("/date/:date",Attendance.getAttendanceByDate); // get attendance by rollno
router.get("/:department/:year",Attendance.getAttendanceByDeptandYear); // get attendance by date

module.exports = router;
