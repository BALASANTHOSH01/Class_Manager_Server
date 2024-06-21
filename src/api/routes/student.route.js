const express = require("express");
const router = express.Router();
const Student = require("../controllers/student.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");

// Student routes
router.post("/create",Authorization,Student.createStudent); // create new student
router.post("/create-many",Authorization,Student.createManyStudents); // create many new student
router.get("/:rollno",Authorization,Student.getStudentByRollno); // Get specific students 
router.get("/:department/:year",Authorization,Student.getStudentByDeptandYear); // get student by "dept & year"
router.patch("/:rollno",Authorization,Student.updateStudent); // update existing student details
router.patch("/update-many",Authorization,Student.updateManyStudent); // update many students
router.delete("/:rollno",Authorization,Student.deleteStudent); // delete student

module.exports = router;
