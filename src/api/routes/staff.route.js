const express = require("express");
const router = express.Router();
const staff = require("../controllers/staff.controller.js");
const auth = require("../controllers/auth.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");
const role = require("../middlewares/role.middleware.js");

// staff routes
router.delete("/:email",Authorization,role.allowedRole("institute", "staff"),staff.deleteStaff); // delete staff
router.patch("/:email",Authorization,role.allowedRole("institute", "staff"),staff.updateStaff); //update staff
router.post("/register",Authorization,role.allowedRole("institute", "staff"),auth.staffRegister); // create new staff
router.get("/:email",Authorization,role.allowedRole("institute", "staff"),staff.getStaff); // login staff 

// Notification routes
router.get("/notifications"); // get notifications

module.exports = router;