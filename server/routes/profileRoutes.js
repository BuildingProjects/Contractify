const express = require('express');
const { editContractorProfile } =  require('../controllers/editProfileController');
const { getContractorProfile } =  require('../controllers/getProfileController');
const { generateToken } = require("../utils/jwtHelper");

const router = express.Router();

router.get('/getContractorProfile', generateToken, getContractorProfile);
router.post('/editContractorProfile',generateToken, editContractorProfile);


module.exports = router;