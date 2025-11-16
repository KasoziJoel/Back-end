// routes/reportingRoutes.js

const express = require('express');
const router = express.Router();
const reportingController = require('../reportingController'); 
const { protectManagerRoute } = require('../../middleware/auth'); 

// --- MANAGER/CEO API ENDPOINTS (Milestone 3) ---

// 1. Get Monthly Sales Summary
router.get('/sales-summary', protectManagerRoute, reportingController.getMonthlySalesSummary);

// 2. Get Stock Turnover Rate
router.get('/stock-turnover', protectManagerRoute, reportingController.getStockTurnoverRate);

// 3. Get Agent Performance Summary (NEW ROUTE)
router.get('/agent-performance', protectManagerRoute, reportingController.getAgentPerformanceSummary);

module.exports = router;