const express = require("express");
const studentsController = require("../Controller/Students.js");
const studentRouter = express.Router();

studentRouter.get("/year/:year", studentsController.getStudentByYear);
studentRouter.get("/department/:department", studentsController.getStudentByDept);
studentRouter.get("/name/:name", studentsController.getStudentByName);
studentRouter.get("/email/:email", studentsController.getStudentByEmail);

module.exports = studentRouter;
