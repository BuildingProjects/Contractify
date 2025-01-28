const express = require('express');
const { contractorSignup , contracteeSignup, contracteeLogin , contractorLogin } = require('../controllers/authController');
const { verifyContractorEmail, verifyContracteeEmail } = require('../controllers/emailverificationController');
const router = express.Router();

router.post('/contractorSignup', contractorSignup);
router.post('/contracteeSignup', contracteeSignup);
router.post('/contractorLogin', contractorLogin);
router.post('/contracteeLogin', contracteeLogin);
router.post('/verifyContractorEmail', verifyContractorEmail);
router.post('/verifyContracteeEmail', verifyContracteeEmail);


module.exports = router;