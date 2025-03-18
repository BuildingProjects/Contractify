const express = require("express");
const {
  createContract,
  getContractsByEmail,
  getContractById,
  acceptContract,
  rejectContract,
  signContractByContractor,
  signContractByContractee,
  generatePDFForExistingContract,
  updateContractStatusToExpired
} = require("../controllers/contractController");
const router = express.Router();

// Routes without authentication
router.post("/createContract", createContract);

// Routes with authentication
router.get("/getContracts/:email", getContractsByEmail);

// Update expired contracts route
router.get('/updateContractStatusToExpired', updateContractStatusToExpired);

// Other routes with :id parameter
router.get("/:id", getContractById);
router.post("/:id/accept", acceptContract);
router.post("/:id/reject", rejectContract);
router.post("/:id/sign/contractor", signContractByContractor);
router.post("/:id/sign/contractee", signContractByContractee);
router.get("/:id/pdf", generatePDFForExistingContract);
router.post("/:id/generate-pdf", generatePDFForExistingContract);

module.exports = router;
