// middleware/auth.js
const jwt = require('jsonwebtoken');

// This function checks for the token and attaches user data to req.user
const protectRoute = (req, res, next) => {
    // 1. Check if the authorization header exists
    const authHeader = req.headers.authorization;
    
    // If header is missing, token is missing
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.error('Authentication Failed: Header missing or not Bearer format.');
        // This is the source of the error you are seeing!
        return res.status(401).json({ 
            message: "Authentication error: Token missing or invalid format (Expected 'Bearer [token]')" 
        });
    }

    // 2. Extract the token string
    const token = authHeader.split(' ')[1]; // Splits 'Bearer token_string' and grabs the token

    try {
        // 3. Verify the token using the secret key from your .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 

        // 4. Attach the decoded user payload to the request object
        // The payload (e.g., { userId: 1, userName: "SAMUEL" }) becomes accessible via req.user
        req.user = decoded; 
        
        // 5. Proceed to the next middleware or controller
        next();

    } catch (err) {
        // Handle invalid token (e.g., expired, modified, or wrong secret)
        console.error('Token Verification Failed:', err.message);
        return res.status(401).json({ message: 'Authentication error: Invalid or expired token.' });
    }
};

module.exports = {
    protectRoute
};