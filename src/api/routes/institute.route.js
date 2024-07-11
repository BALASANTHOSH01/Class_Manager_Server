const express = require("express");
const router = express.Router();
const InstituteController = require("../controllers/institute.controller.js");
const role = require("../middlewares/role.middleware.js");
const Authorization = require("../middlewares/auth.middleware.js");

router.delete("/delete" , Authorization , role.allowedRole("institute") , InstituteController.deleteInstitute);
router.patch("/update" , Authorization , role.allowedRole("institute") , InstituteController.updateInstitute);
router.get("/:name"  , InstituteController.getInstituteByName); // get institute details by name
router.get("/college-code/:college_code"  , InstituteController.getInstituteByCollegeCode); // get institute details by college Code

module.exports = router;