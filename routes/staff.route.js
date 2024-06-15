const express = require("express");
const router = express.Router();
const Student = require('../controllers/student.controller.js');
const Attendance = require("../controllers/attendance.controller.js");

// Student routes
router.post("/students",Student.createStudent); // create new student
router.patch("/students/:email",Student.updateStudent); // update existing student details
router.delete("/students/:email",Student.deleteStudent); // delete student
router.get("/students/:email",Student.getStudentByRollno); // Get specific students 
router.get("/students/:department/:year",Student.getStudentByDeptandYear); // get student by "dept & year"


// Attendance routes
router.patch("/attendance/:date/:rollno",Attendance.updateAttendance); // update attendance
router.post("/attendance",Attendance.takeAttendance); // take attendance
router.get("/attendance/:department/:year/:date",Attendance.getAttendanceByDeptYearandDate); // get attendance by date
router.get("/attendance/:rollno",Attendance.getAttendanceByRollno); // get attendance by rollno
router.get("/attendance/date/:date",Attendance.getAttendanceByDate); // get attendance by rollno
router.get("/attendance/:department/:year",Attendance.getAttendanceByDeptandYear); // get attendance by date


// Notification routes
router.get("/notifications"); // get notifications

module.exports = router;