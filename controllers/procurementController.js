// ProcurementController.js

const dbPool = require("./routes/config/db");

async function recordNewProcurement(req, res) {
  // 1. Extract and Validate Input Data
  const {
    dealerId,
    branchId,
    tonnage, // Variable name: tonnage (lowercase t)
    costPerTon,
    produceName, // e.g., 'Maize'
  } = req.body;

  // Error Handling and Validation (Milestone Four)
  if (!dealerId || !tonnage || !branchId || !costPerTon || !produceName) {
    return res
      .status(400)
      .send({ message: "Missing required procurement data." });
  }

  let connection;

  try {
    connection = await dbPool.getConnection();
    // Start a transaction: Ensures both INSERT and UPDATE succeed or both fail (Atomicity).
    await connection.beginTransaction();

    // 2. Look up the Produce_ID from the Produce Name
    const [produceResult] = await connection.execute(
      `SELECT Produce_ID FROM produce WHERE Name = ?;`,
      [produceName]
    );

    if (produceResult.length === 0) {
      // Throwing a dedicated error here is great for debugging (Milestone Four)
      throw new Error(`Produce type '${produceName}' not found.`);
    }
    const produceId = produceResult[0].Produce_ID;

    // 3. Insert the new record into the PROCUREMENT Table
    const insertQuery = `
            INSERT INTO procurement 
            (Dealer_ID, Branch_ID, Tonnage, Cost_per_ton, Produce_ID, Date) 
            VALUES (?, ?, ?, ?, ?, NOW()); 
        `;

    const insertValues = [dealerId, branchId, tonnage, costPerTon, produceId];

    const [insertResult] = await connection.execute(insertQuery, insertValues);

    // 4. Update the STOCK Table by increasing tonnage
    const updateQuery = `
            UPDATE stock 
            SET Current_tonnage = Current_tonnage + ?, Last_updated = NOW() 
            WHERE Produce_ID = ? AND Branch_ID = ?; 
        `;
    // 🚨 FIX APPLIED: Changed 'Last_Update' to 'Last_updated' to match the schema.

    const updateValues = [tonnage, produceId, branchId];
    const [updateResult] = await connection.execute(updateQuery, updateValues);

    // Ensure the update was successful (i.e., the stock row existed)
    if (updateResult.affectedRows === 0) {
      // NOTE: If you need to handle initial stock records, you would INSERT here.
      throw new Error(
        `Stock record for Produce ID ${produceId} at Branch ID ${branchId} was not updated (Missing initial stock row).`
      );
    }

    // 5. Commit the transaction (Both queries succeeded)
    await connection.commit();

    res.status(201).json({
      message: "Procurement recorded and stock updated successfully.",
      procurementId: insertResult.insertId,
    });
  } catch (error) {
    // 6. Rollback the transaction on failure
    if (connection) {
      await connection.rollback();
    }
    console.error("Database Transaction Failed:", error.message);

    // Handling the error if the initial stock record is missing (from the thrown error above)
    let status = 500;
    if (error.message.includes("Stock record for Produce ID")) {
      status = 400; // Return a client-side error if the stock row is missing
    }

    // Return a cleaner, more readable error message (Milestone Four: Error Handling)
    res.status(status).json({
      message: `Procurement failed. Transaction rolled back. Reason: ${error.message}`,
    });
  } finally {
    // 7. Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
}

module.exports = {
  recordNewProcurement,
};
