const express = require("express");
const router = express.Router();
const staff = require("../controllers/staff.controller.js");
const auth = require("../controllers/auth.controller.js");

// staff routes
router.delete("/:email",staff.deleteStaff); // delete staff
router.patch("/:email",staff.updateStaffByEmail); //update staff
router.post("/register",auth.staffRegister); // create new staff
router.get("/:email",staff.getStaffByEmail); // get staff 

// Notification routes
router.get("/notifications"); // get notifications

module.exports = router;