const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/token.controller");

router.get("/refresh-token",tokenController.refreshToken);

module.exports = router; 