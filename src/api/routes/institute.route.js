const express = require("express");
const router = express.Router();
const InstituteController = require("../controllers/institute.controller.js");

router.delete("/delete", InstituteController.deleteInstitute);
router.patch("/update", InstituteController.updateInstitute);

module.exports = router;