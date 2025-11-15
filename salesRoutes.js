const express = require('express');
const router = express.Router();

// (or just 'salesController') since both files are in the same root directory.
const salesController = require('./salesController'); 

// We need to go up to the middleware folder, which is where it should be located.
const { protectRoute } = require('./middleware/auth'); 

// Defines the '/record' part of the URL: /sales/record
router.post('/record', protectRoute, salesController.recordNewSale);

module.exports = router;