const express = require("express");
const router = express.Router();
const Student = require("../controllers/student.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");
const role = require("../middlewares/role.middleware.js");

router.post("/create-many", Authorization, role.notAllowedRole("student"), role.allowedRole("institute", "staff"), Student.createManyStudents);

router.post("/:institute/:rollno", Authorization, role.allowedRole("institute", "staff", "student"), Student.getStudentByRollno);

router.get("/:department/:year", Authorization, role.allowedRole("institute", "staff"), Student.getStudentByDeptandYear);

router.patch("/:rollno", Authorization, role.allowedRole("institute", "staff"), Student.updateStudent);

router.patch("/update-many", Authorization, role.notAllowedRole("student"), role.allowedRole("institute", "staff"), Student.updateManyStudent);

router.delete("/:rollno", Authorization, role.allowedRole("institute", "staff"), Student.deleteStudent);

module.exports = router;
