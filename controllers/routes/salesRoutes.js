const express = require("express");
const router = express.Router();

// CORRECTED PATH: Goes up one level (from 'routes' to 'controllers') to find the controller
const salesController = require('../salesController');

// CORRECTED PATH: Goes up two levels (from 'routes' to 'controllers' to 'Back-end') to find the middleware
const { protectRoute } = require("../../middleware/auth");

// Define the POST route for recording a new sale
// This route will be mounted under '/sales' in the main app.js file.
router.post("/record", protectRoute, salesController.recordNewSale);

// Define the GET route for viewing inventory
router.get("/inventory", protectRoute, salesController.viewInventory);

module.exports = router;