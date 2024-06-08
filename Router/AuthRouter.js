const express = require("express");
const router = express.Router();
const Controller = require("../Controller/Controller.js");

router.post("/register",Controller.createUser);

module.exports = router;