const express = require("express");
const router = express.Router();
const Student = require('../controllers/student.controller.js');

// Student routes
router.post("/students",Student.createStudent); // create new student
router.patch("/students/:id",Student.updateStudent); // update existing student details
router.delete("/students/:id",Student.deleteStudent); // delete student
router.get("/students/:id",Student.getStudentByRollno); // Get specific students 
router.get("/students/:department/:year",Student.getStudentByDeptandYear); // get student by "dept & year"

// Attendance routes
router.post("/attendance"); // take attendance
router.patch("/attendance/:id"); // update attendance
router.get("/attendance/:date"); // get attendance by date

// Notification routes
router.get("/notifications"); // get notifications

module.exports = router;