const express = require("express");
const router = express.Router();
const InstituteController = require("../controllers/institute.controller.js");
const role = require("../middlewares/role.middleware.js");
const Authorization = require("../middlewares/auth.middleware.js");

router.delete("/delete" , Authorization , role("institute") , InstituteController.deleteInstitute);
router.patch("/update" , Authorization , role("institute") , InstituteController.updateInstitute);
router.get("/:name"  , InstituteController.getInstituteByName); // get details institute by name

module.exports = router;