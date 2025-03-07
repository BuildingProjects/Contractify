const express = require("express");
const {
  createContract,
  getContractsByEmail,
  acceptContract,
  rejectContract,
  generateContractPDF,
  signContractByContractor,
  signContractByContractee,
} = require("../controllers/contractController");
const { updateContractStatusToExpired } = require("../controllers/contractStatusController");
const { verifyToken } = require("../utils/jwtHelper");
const router = express.Router();

router.post("/createContract", verifyToken, createContract);
router.get("/getContracts/:email", verifyToken, getContractsByEmail);
router.get("/acceptContract/:id", acceptContract);
router.get("/rejectContract/:id", rejectContract);
router.post(
  "/signContract/contractor/:id",
  verifyToken,
  signContractByContractor
);
router.post(
  "/signContract/contractee/:id",
  verifyToken,
  signContractByContractee
);
router.get("/generatePDF/:id", generateContractPDF);
router.get("/updateContractStatusToExpired", verifyToken, updateContractStatusToExpired);

module.exports = router;
