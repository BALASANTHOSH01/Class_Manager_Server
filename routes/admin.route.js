const express = require("express");
const router = express.Router();

const Student = require("../controllers/student.controller.js");
const Staff = require("../controllers/staff.controller.js");
const Auth = require("../controllers/auth.controller.js");
const Attendance = require("../controllers/attendance.controller.js");

// Student routes
router.delete("/students/:rollno",Student.deleteStudent); // delete student
router.patch("/students/:rollno",Student.updateStudent); // update existing student details
router.post("/students",Student.createStudent); // create new student
router.get("/students/:rollno",Student.getStudentByRollno); // Get specific students 
router.get("/students/:department/:year",Student.getStudentByDeptandYear); // get student by "dept & year"

// Attendance routes
router.patch("/attendance/:date/:rollno",Attendance.updateAttendance); // update attendance
router.post("/attendance",Attendance.takeAttendance); // take attendance
router.get("/attendance/:department/:year/:date",Attendance.getAttendanceByDeptYearandDate); // get attendance by date
router.get("/attendance/:rollno",Attendance.getAttendanceByRollno); // get attendance by rollno
router.get("/attendance/date/:date",Attendance.getAttendanceByDate); // get attendance by rollno
router.get("/attendance/:department/:year",Attendance.getAttendanceByDeptandYear); // get attendance by date

// Staff routes
router.delete("/staff/:email",Staff.deleteStaff); // delete staff
router.patch("/staff/:email",Staff.updateStaffByEmail); //update staff
router.post("/staff/register",Auth.staffRegister); // create new staff
router.get("/staff/:email",Staff.getStaffByEmail); // get staff 

// Notification routes
router.get("/notifications"); // Notification


module.exports = router;