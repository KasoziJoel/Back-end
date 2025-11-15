const dbPool = require('./config/db'); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "a_secure_default_secret_for_gcdl";

// Handles POST /login logic
async function login(req, res) {
    const { UserName, Password } = req.body;

    if (!UserName || !Password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    let connection;
    try {
        connection = await dbPool.getConnection();
        const [rows] = await connection.execute(
            "SELECT * FROM users WHERE UserName = ?",
            [UserName]
        );

        if (rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = rows[0];
        const passwordMatch = await bcrypt.compare(Password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const tokenPayload = {
            userId: user.User_ID,
            role: user.Role,
            branchId: user.Branch_ID,
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, {
            expiresIn: "24h",
        });

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
        console.error("Login database error:", error);
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
}

// Handles POST /register logic
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