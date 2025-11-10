// routes/procurementRoutes.js

const express = require('express');
const router = express.Router();
const { recordNewProcurement } = require('../controllers/procurementController'); // Note: The path here might need adjustment

// When a POST request comes to '/procurement', run the function from the controller
router.post('/procurement', recordNewProcurement);

module.exports = router;