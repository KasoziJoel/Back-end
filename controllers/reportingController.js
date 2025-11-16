// controllers/reportingController.js

const dbPool = require('./routes/config/db'); 

// --- 1. Get Monthly Sales Summary for Dashboard ---
async function getMonthlySalesSummary(req, res) {
    let connection;
    try {
        connection = await dbPool.getConnection();
        
        const [results] = await connection.execute(
            `
            SELECT 
                YEAR(Date) AS Sale_Year,
                MONTH(Date) AS Sale_Month,
                SUM(Total_sale_value) AS Total_Sales_Value
            FROM sales
            GROUP BY Sale_Year, Sale_Month
            ORDER BY Sale_Year DESC, Sale_Month DESC;
            `
        );

        res.status(200).json({
            message: "Monthly sales summary retrieved successfully.",
            data: results
        });

    } catch (error) {
        console.error("Error fetching monthly sales summary:", error.message);
        res.status(500).json({ message: "Internal server error fetching sales report." });
    } finally {
        if (connection) connection.release();
    }
}


// --- 2. Calculate Stock Turnover Rate ---
async function getStockTurnoverRate(req, res) {
    let connection;
    try {
        connection = await dbPool.getConnection();

        // Step A: Calculate Total Sales Value (Last 12 Months)
        const [salesResults] = await connection.execute(
            `SELECT SUM(Total_sale_value) AS Total_Sales_Value FROM sales WHERE Date >= DATE_SUB(NOW(), INTERVAL 12 MONTH);`
        );
        const totalSalesValue = salesResults[0].Total_Sales_Value || 0;

        // Step B: Calculate Total Procurement Cost (Proxy for Average Inventory Value)
        const [procurementResults] = await connection.execute(
            `SELECT SUM(Cost_per_ton) AS Total_Procurement_Cost FROM procurement WHERE Date >= DATE_SUB(NOW(), INTERVAL 12 MONTH);`
        );
        const totalProcurementCost = procurementResults[0].Total_Procurement_Cost || 0;
        
        let stockTurnoverRate = 0;
        if (totalProcurementCost > 0) {
            stockTurnoverRate = (totalSalesValue / totalProcurementCost);
        }

        res.status(200).json({
            message: "Stock turnover rate calculated successfully.",
            data: {
                totalSalesValue: parseFloat(totalSalesValue.toFixed(2)),
                totalProcurementCost: parseFloat(totalProcurementCost.toFixed(2)),
                stockTurnoverRate: parseFloat(stockTurnoverRate.toFixed(4)),
                interpretation: stockTurnoverRate > 3 ? "High turnover (Efficient sales relative to inventory cost)" : 
                                stockTurnoverRate > 1 ? "Moderate turnover" : 
                                "Low turnover (Potential overstocking or slow sales)"
            }
        });

    } catch (error) {
        console.error("Error calculating stock turnover rate:", error.message);
        res.status(500).json({ message: "Internal server error calculating stock turnover rate." });
    } finally {
        if (connection) connection.release();
    }
}


// --- 3. Get Agent Performance Summary ---
/**
 * @route GET /reporting/agent-performance
 * @desc Retrieves total sales value and transaction count grouped by sales agent.
 * @access Private (Requires Manager Role)
 */
async function getAgentPerformanceSummary(req, res) {
    let connection;
    try {
        connection = await dbPool.getConnection();
        
        // **FINAL FIX: Using the correct column names from the provided schema images**
        const [results] = await connection.execute(
            `
            SELECT 
                u.User_ID AS Agent_ID,
                u.UserName,
                SUM(s.Total_sale_value) AS Total_Sales_Value,
                COUNT(s.Sales_ID) AS Number_of_Transactions
            FROM sales s
            JOIN users u ON s.Sale_Agent_ID = u.User_ID
            GROUP BY u.User_ID, u.UserName
            ORDER BY Total_Sales_Value DESC;
            `
        );

        res.status(200).json({
            message: "Agent performance summary retrieved successfully.",
            data: results
        });

    } catch (error) {
        // Logging the full error object for any unexpected issues
        console.error("Full SQL Error Object:", error); 
        res.status(500).json({ message: "Internal server error fetching agent performance summary." });
    } finally {
        if (connection) connection.release();
    }
}


module.exports = {
    getMonthlySalesSummary,
    getStockTurnoverRate,
    getAgentPerformanceSummary
};