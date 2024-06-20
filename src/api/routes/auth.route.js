const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller.js");

//institute auth
router.post("/institute/register",AuthController.registerInstitute);
router.post("/institute/login",AuthController.loginInstitute);

// staff auth
router.post("/staff/register",AuthController.staffRegister);
router.post("/staff/login",AuthController.staffLogin);

module.exports = router;