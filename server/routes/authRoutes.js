const express = require('express');
const { contractorSignup , contracteeSignup, contracteeLogin , contractorLogin } = require('../controllers/authController');
const router = express.Router();

router.post('/contractorSignup', contractorSignup);
router.post('/contracteeSignup', contracteeSignup);
router.post('/contractorLogin', contractorLogin);
router.post('/contracteeLogin', contracteeLogin);

module.exports = router;