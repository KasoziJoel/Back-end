//app.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
// NOTE: bcrypt and jwt imports are useful for context but aren't strictly needed in app.js if they are only used in authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const corsOptions = {
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
// 1.Route Imports
// All route files (authRoutes, salesRoutes, etc.) are located in the './controllers/routes/' directory.
const authRoutes = require('./controllers/routes/authRoutes');
const salesRoutes = require('./controllers/routes/salesRoutes');
const procurementRoutes = require('./controllers/routes/procurementRoutes');
const reportingRoutes = require('./controllers/routes/reportingRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors(corsOptions)); 
app.use(express.json());
 // Allows parsing JSON bodies (for req.body)
 // Simple test route
app.get('/auth/test', (req, res) => {
    res.status(200).json({ message: 'Server running', status: 'OK' });
});


// 2. Middleware

// 3. Routing Setup
// A. User Authentication (Handles /login and /register)
app.use('/auth', authRoutes);

// B. Core System Routes: Procurement
app.use('/procurement', procurementRoutes); 

// C. Core System Routes: Sales
app.use('/sales', salesRoutes); 

// D. Manager Reports (Milestone 3)
app.use('/reporting', reportingRoutes);

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});