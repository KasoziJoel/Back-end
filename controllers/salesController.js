// salesController.js

const dbPool = require('./routes/config/db'); // Corrected path from earlier fixes

// Handles the logic for recording a new sale transaction
async function recordNewSale(req, res) {
 const { 
 branchId, 
 tonnage, 
 sellingPricePerTon, 
 produceName,
 buyerName, 
 saleType  
 } = req.body; 

 // 1. Initial Validation
 if (!tonnage || !branchId || !sellingPricePerTon || !produceName || !buyerName || !saleType) {
 return res.status(400).send({ message: "Missing required sales data." });
}
// Get user ID from the JWT payload
 if (!req.user || !req.user.userId) {
return res.status(401).send({ message: "Authentication error: Sale Agent ID is missing." });
}
const saleAgentId = req.user.userId; 

 let connection; 

 try {
 connection = await dbPool.getConnection();
 await connection.beginTransaction(); 

 // 2. Look up the Produce_ID from the Produce Name
 const [produceResult] = await connection.execute(
 `SELECT Produce_ID FROM produce WHERE Name = ?;`,
 [produceName]
);

 if (produceResult.length === 0) {
 throw new Error(`Produce type '${produceName}' not found.`);
}
const produceId = produceResult[0].Produce_ID;
 // 3. Check if stock is sufficient BEFORE inserting the sale
 const [stockCheck] = await connection.execute(
`SELECT Current_tonnage FROM stock WHERE Produce_ID = ? AND Branch_ID = ? FOR UPDATE;`, 
[produceId, branchId]
);
 
 if (stockCheck.length === 0 || stockCheck[0].Current_tonnage < tonnage) {
 throw new Error(`Sale failed. Insufficient stock for ${produceName}. Available: ${stockCheck[0]?.Current_tonnage || 0} tons.`);
}
 // 4. Calculate total values
 const totalSaleValue = parseFloat(tonnage) * parseFloat(sellingPricePerTon);
 const amountPaid = totalSaleValue; 
 // 5. Insert the new record into the SALES Table
 const insertQuery = `
 INSERT INTO sales 
(Produce_ID, Selling_per_ton, Amount_paid, Sale_type, Total_sale_value, Sale_agent_ID, Buyer_name, Date) 
 VALUES (?, ?, ?, ?, ?, ?, ?, NOW()); 
 `;
 
 const insertValues = [
 produceId, 
 sellingPricePerTon, 
 amountPaid, 
 saleType,  
 totalSaleValue,
 saleAgentId, 
 buyerName
 ];
 
 const [insertResult] = await connection.execute(insertQuery, insertValues); 
 
 // 6. Update the STOCK Table by DECREASING tonnage
 const updateQuery = `
 UPDATE stock 
 SET Current_tonnage = Current_tonnage - ?, Last_updated = NOW() 
 WHERE Produce_ID = ? AND Branch_ID = ?; 
 `;

 const updateValues = [tonnage, produceId, branchId]; 
 await connection.execute(updateQuery, updateValues);
 
 // 7. Commit the transaction
 await connection.commit(); 
 res.status(201).json({ 
message: "Sale recorded and stock updated successfully.", 
saleId: insertResult.insertId 
 });

} catch (error) {
 // 8. Rollback the transaction on failure
 if (connection) {
await connection.rollback(); 
 }
console.error("Database Transaction Failed during Sale:", error.message);
 
 let status = 500;
if (error.message.includes('Insufficient stock') || error.message.includes('foreign key constraint') || error.message.includes('not found')) {
status = 400; 
}

res.status(status).json({ 
message: `Sale failed. Transaction rolled back. Reason: ${error.message}` 
 });

 } finally {
// 9. Release the connection
if (connection) {
 connection.release();
 }
}
}


// ADDED FUNCTION: Handles the logic for viewing inventory at the user's branch
async function viewInventory(req, res) {
    // Get branchId from the JWT payload
    const branchId = req.user?.branchId; 
    
    if (!branchId) {
        return res.status(401).json({ message: "Branch ID not available from token." });
    }

    let connection;

    try {
        connection = await dbPool.getConnection();
        
        // Query to get stock for the current user's branch
        const [inventory] = await connection.execute(
            `
            SELECT 
                s.Stock_ID, 
                p.Name AS Produce_Name, 
                s.Current_tonnage, 
                s.Last_updated
            FROM stock s
            JOIN produce p ON s.Produce_ID = p.Produce_ID
            WHERE s.Branch_ID = ? AND s.Current_tonnage > 0
            ORDER BY p.Name;
            `,
            [branchId]
        );

        res.status(200).json({ 
            message: "Inventory retrieved successfully.", 
            inventory 
        });

    } catch (error) {
        console.error("Failed to retrieve inventory:", error.message);
        res.status(500).json({ 
            message: `Failed to retrieve inventory. Reason: ${error.message}` 
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


module.exports = {
    recordNewSale,
    viewInventory 
};