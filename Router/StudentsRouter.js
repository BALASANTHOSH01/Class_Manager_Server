const express = require("express");
const studentRoute = express.Router();
const studentController = require("../Controller/Students.js");


studentRoute.get("/department/year",studentController.getStudentByYear);
studentRoute.get("/department",studentController.getStudentByDept);

module.exports = studentRoute;