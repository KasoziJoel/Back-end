const dbPool = require('./routes/config/db'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "a_secure_default_secret_for_gcdl";

// Handles POST /login logic
async function login(req, res) {
    // Extract potential username/password from request body (handles both capitalized and lowercase keys)
    const { UserName, Password, username , password } = req.body;
    
    // Determine the final values to use for database lookup and comparison
    const finalUsername = UserName || username; 
    const finalPassword = Password || password;

    if (!finalUsername || !finalPassword) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    let connection;
    try {
        // --- DIAGNOSTIC LOG ---
        console.log(`Attempting login for username: ${finalUsername}`);

        connection = await dbPool.getConnection();
        const [rows] = await connection.execute(
            // Use the final resolved username to query the 'users' table
            "SELECT * FROM users WHERE UserName = ?",
            [finalUsername]
        );

        if (rows.length === 0) {
            console.log(`Login Failed (401): User "${finalUsername}" not found in database.`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        
        // --- DIAGNOSTIC LOG ---
        console.log(`User found. Database Hash Status: ${user.Password ? 'Present' : 'Missing'}`);

        // Perform password comparison using the final resolved password
        const passwordMatch = await bcrypt.compare(finalPassword, user.Password);

        if (!passwordMatch) {
            console.log(`Login Failed (401): Password mismatch for user "${finalUsername}".`);
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Login success
        const tokenPayload = {
            userId: user.User_ID,
            role: user.Role,
            branchId: user.Branch_ID,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: "24h",
        });
        
        console.log(`Login Succeeded (200) for user: ${finalUsername}`);

        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: {
                userId: user.User_ID,
                userName: user.UserName,
                role: user.Role,
                branchId: user.Branch_ID,
            },
        });
    } catch (error) {
        // This catch block runs for database connection errors or uncaught exceptions
        console.error("Login database error (500):", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
}

// Handles POST /register logic (left unchanged)
async function registerUser(req, res) {
    const { UserName, Password, Role, Branch_ID } = req.body;

    if (!UserName || !Password || !Role || !Branch_ID) {
        return res.status(400).json({ message: "Missing required fields: UserName, Password, Role, and Branch_ID are necessary." });
    }

    let connection;

    try {
        connection = await dbPool.getConnection();
        
        // 1. Check if user already exists
        const [existingUsers] = await connection.execute(
            `SELECT User_ID FROM users WHERE UserName = ?`,
            [UserName]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({ message: "User name already exists. Please choose a different name." });
        }

        // 2. Hash the password before storing it
        const hashedPassword = await bcrypt.hash(Password, 10); 

        // 3. Insert new user
        const insertQuery = `
            INSERT INTO users (UserName, Password, Role, Branch_ID)
            VALUES (?, ?, ?, ?);
        `;
        const insertValues = [UserName, hashedPassword, Role, Branch_ID];
        const [insertResult] = await connection.execute(insertQuery, insertValues);

        res.status(201).json({ 
            message: "User registered successfully.", 
            userId: insertResult.insertId 
        });

    } catch (error) {
        console.error("User Registration Failed:", error.message);
        let status = 500;
        if (error.message.includes('foreign key constraint fails')) {
            status = 400;
        }

        res.status(status).json({ 
            message: `Registration failed due to a server error. Reason: ${error.message}` 
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


module.exports = {
    login, 
    registerUser
};