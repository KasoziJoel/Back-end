// app.js (The Main Server File)

// 1. Get packages and setup Express
const express = require('express');
const dotenv = require('dotenv');
// Import existing, correctly located routers
const authRoutes = require('./controllers/routes/authRoutes');
const procurementRoutes = require('./controllers/routes/procurementRoutes'); 

// Import NEW routers from the ROOT directory (where they currently are)
const salesRoutes = require('./salesRoutes'); 

// We need these for the login route (though not directly used here, good for context)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000; 

// 2. Middleware
app.use(express.json()); // Allows parsing JSON bodies (for req.body)

// 3. Routing
// A. User Authentication (Handles /login and /register)
app.use('/', authRoutes);

// B. Core System Routes: Procurement (Handles /procurement/record)
app.use('/procurement', procurementRoutes); 

// C. Core System Routes: Sales (Handles /sales/record)
app.use('/sales', salesRoutes); 

// 4. Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});