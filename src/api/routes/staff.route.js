const express = require("express");
const router = express.Router();
const staff = require("../controllers/staff.controller.js");
const auth = require("../controllers/auth.controller.js");
const Authorization = require("../middlewares/auth.middleware.js");


// staff routes
router.delete("/:email",Authorization,staff.deleteStaff); // delete staff
router.patch("/:email",Authorization,staff.updateStaffByEmail); //update staff
router.post("/register",Authorization,auth.staffRegister); // create new staff
router.get("/:email",Authorization,staff.getStaffByEmail); // login staff 

// Notification routes
router.get("/notifications"); // get notifications

module.exports = router;