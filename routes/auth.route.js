const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller.js");

// admin auth
router.post("/admin/register",AuthController.adminRegister);
router.post("/admin/login",AuthController.adminLogin);

// staff auth
router.post("/staff/register",AuthController.staffRegister);
router.post("/staff/login",AuthController.staffLogin);

module.exports = router;