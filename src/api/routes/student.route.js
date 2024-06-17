const express = require("express");
const router = express.Router();
const Student = require("../controllers/student.controller.js");

// Student routes
router.post("/create",Student.createStudent); // create new student
router.post("/createmany",Student.createManyStudents); // create many new student
router.get("/:rollno",Student.getStudentByRollno); // Get specific students 
router.get("/:department/:year",Student.getStudentByDeptandYear); // get student by "dept & year"
router.patch("/:rollno",Student.updateStudent); // update existing student details
router.delete("/:rollno",Student.deleteStudent); // delete student

module.exports = router;
