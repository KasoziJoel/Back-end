// config/db.js : This file reads the credentials from the .env and exports a connection pool that the controllers can use

const mysql = require('mysql2/promise'); // Using promise-based client
require('dotenv').config(); // Load environment variables from .env

// Create a connection pool using the credentials you verified
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'GCDL_DB',
    port: process.env.DB_PORT || 3307, // CRITICAL: Use your custom port!
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`Database pool created for: ${process.env.DB_NAME} on port ${process.env.DB_PORT}`);

module.exports = pool; // Export the pool so other files can use it
