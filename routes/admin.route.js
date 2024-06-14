const express = require("express");
const router = express.Router();

const Student = require("../controllers/student.controller.js");
const Auth = require("../controllers/auth.controller.js");

// Student routes
router.post("/students",Student.createStudent); // create new student
router.patch("/students/:rollno",Student.updateStudent); // update existing student details
router.delete("/students/:rollno",Student.deleteStudent); // delete student
router.get("/students/:rollno",Student.getStudentByRollno); // Get specific students 
router.get("/students/:department/:year",Student.getStudentByDeptandYear); // get student by "dept & year"

// Attendance routes
router.post("/attendance"); // take attendance
router.patch("/attendance/:id"); // update attendance
router.get("/attendance/:date"); // get attendance by date

// Staff routes
router.delete("/staff/:id"); // delete staff
router.patch("/staff/:id"); //update staff
router.post("/staff",Auth.staffRegister); // create new staff
router.get("/staff/:id"); // get staff 

// Notification routes
router.get("/notifications"); // Notification


module.exports = router;