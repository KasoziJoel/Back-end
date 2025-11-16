const express = require('express');
const router = express.Router();

// NOTE: The path for the controller requires adjusting based on the file structure.
// This path is correct if this file is in /controllers/routes/ and the controller is in /controllers/
const procurementController = require('../procurementController'); 
const { protectRoute } = require('../../middleware/auth'); // Path to middleware

// Define the POST route for recording a new procurement
// This route now uses '/record' as the path, and it is secured by 'protectRoute'
// Full URL will be: http://localhost:3000/procurement/record
router.post('/record', protectRoute, procurementController.recordNewProcurement);


module.exports = router;

