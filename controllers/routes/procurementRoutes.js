// const express = require('express');
// const router = express.Router();

// const { procurementController } = require('../procurementController'); 
// const { protectRoute } = require('../../middleware/auth');

// // Define the POST route for recording a new procurement
// // This route is typically mounted under '/api' in the main app.js file.
// router.post('/procurementController', procurementController.recordNewProcurement);

// module.exports = router;

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
// 🚨 FIX 1: Path changed from '/procurementController' to '/record'
// 🚨 FIX 2: Added protectRoute middleware (it should now light up)

module.exports = router;

