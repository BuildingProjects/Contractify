const express = require("express");
const {
  createContract,
  getContractsByEmail,
  acceptContract,
  rejectContract,
  generateContractPDF,
} = require("../controllers/contractController");
const { verifyToken } = require("../utils/jwtHelper");
const router = express.Router();

router.post("/createContract", verifyToken, createContract);
router.get("/getContracts/:email", verifyToken, getContractsByEmail);
router.get("/acceptContract/:id", acceptContract);
router.get("/rejectContract/:id", rejectContract);
router.get("/generatePDF/:id", generateContractPDF);

module.exports = router;
