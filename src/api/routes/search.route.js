const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/search.controller");
const Authorization = require("../middlewares/auth.middleware.js");
const role = require("../middlewares/role.middleware.js");

router.get("/staff", Authorization, role.allowedRole("institute", "staff", "student"), SearchController.searchStaff);
router.get("/student", Authorization, role.allowedRole("institute", "staff"), SearchController.searchStudent);
router.get("/institute", Authorization, role.allowedRole("institute", "staff", "student"), SearchController.searchInstitute);

module.exports = router;
