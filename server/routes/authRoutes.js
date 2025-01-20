const express = require('express');
const { contractorSignup , contracteeSignup, contracteeLogin , contractorLogin } = require('../controllers/authController');
const { contractorVerifyEmail, contracteeVerifyEmail } = require('../controllers/emailverificationController');
const router = express.Router();

router.post('/contractorSignup', contractorSignup);
router.post('/contracteeSignup', contracteeSignup);
router.post('/contractorLogin', contractorLogin);
router.post('/contracteeLogin', contracteeLogin);
router.post('/contractorVerifyEmail', contractorVerifyEmail);
router.post('/contracteeVerifyEmail', contracteeVerifyEmail);


module.exports = router;