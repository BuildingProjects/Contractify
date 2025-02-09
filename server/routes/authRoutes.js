const express = require('express');
const { contractorSignup , contracteeSignup, contracteeLogin , contractorLogin } = require('../controllers/authController');
const { verifyContractorEmail, verifyContracteeEmail } = require('../controllers/emailverificationController');
const { resendContractorVerificationMail, resendContracteeVerificationMail } = require('../controllers/resendVerficationMailController');
const { verifyToken } = require('../utils/jwtHelper');
const { changePassword } = require('../controllers/changePasswordController');


const router = express.Router();

router.post('/contractorSignup', contractorSignup);
router.post('/contracteeSignup', contracteeSignup);
router.post('/contractorLogin', contractorLogin);
router.post('/contracteeLogin', contracteeLogin);
router.post('/verifyContractorEmail', verifyToken, verifyContractorEmail);
router.post('/verifyContracteeEmail', verifyToken, verifyContracteeEmail);
router.get('/resendContractorVerificationMail',verifyToken, resendContractorVerificationMail);
router.get('/resendContracteeVerificationMail',verifyToken, resendContracteeVerificationMail);
router.post('/changePassword', verifyToken, changePassword);


module.exports = router;