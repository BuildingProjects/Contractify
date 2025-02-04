const express = require("express");
const { createContract } = require("../controllers/contractController");
const {verifyToken} = require("../utils/jwtHelper");
const router = express.Router();

router.post("/createContract", verifyToken, createContract);

module.exports = router;
