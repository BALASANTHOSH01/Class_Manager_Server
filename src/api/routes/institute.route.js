const express = require("express");
const router = express.Router();
const InstituteController = require("../controllers/institute.controller.js");

router.delete("/:id", InstituteController.deleteInstitute);
router.patch("/:id", InstituteController.updateInstitute);

module.exports = router;