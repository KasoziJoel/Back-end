// // controllers/procurementController.js

// async function recordNewProcurement(req, res) {
//     // ... all the code for validation and SQL execution goes here
// }

// module.exports = {
//     recordNewProcurement
// };
// controllers/procurementController.js: It uses the connection from db.js to run the two critical database actions within a transaction

const dbPool = require('../config/db'); // 1. Import the database pool you just created

async function recordNewProcurement(req, res) {
    // Data read from the request
    const { 
        dealerId, 
        branchId, 
        tonnage, 
        costPerTon, 
        produceType 
    } = req.body; 

    // Basic Validation (from your flowchart)
    if (!dealerId || !tonnage || !branchId || !costPerTon || !produceType) {
        return res.status(400).send({ message: "Missing required procurement data." });
    }
    
    let connection; // Declare connection for transaction handling

    try {
        // Start a transaction to ensure both queries succeed or fail together (CRITICAL for stock updates)
        connection = await dbPool.getConnection();
        await connection.beginTransaction(); 

        // --------------------------------------------------------------------
        // QUERY 1: Insert into the PROCUREMENT Table (Your first write action)
        // --------------------------------------------------------------------
        const insertQuery = `
            INSERT INTO procurement 
            (Dealer_ID, Branch_ID, Tonnage, Cost_per_ton, Type) 
            VALUES (?, ?, ?, ?, ?); 
        `;
        const insertValues = [dealerId, branchId, tonnage, costPerTon, produceType];
        await connection.execute(insertQuery, insertValues);
        
        // --------------------------------------------------------------------
        // QUERY 2: Update the STOCK Table (Your second write action)
        // --------------------------------------------------------------------
        // We assume 'produce' table has a 'Name' column to find the ID.
        const updateQuery = `
            UPDATE stock 
            SET Tonnage = Tonnage + ? 
            WHERE Produce_Name = ?; 
        `;
        const updateValues = [tonnage, produceType]; // Update stock by adding the tonnage
        await connection.execute(updateQuery, updateValues);

        // If both queries succeed: Commit the transaction
        await connection.commit(); 

        res.status(201).send({ message: "Procurement recorded and stock updated successfully." });

    } catch (error) {
        // If anything fails, rollback the transaction to undo any partial changes
        if (connection) {
            await connection.rollback();
        }
        console.error("Database Transaction Failed:", error);
        res.status(500).send({ message: "Procurement failed due to a server error. Transaction rolled back." });

    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    recordNewProcurement
};