const jwt = require('jsonwebtoken');

// --- 1. General Route Protection (protectRoute) ---
// Checks for a valid token and attaches user data (req.user)
const protectRoute = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            message: "Authentication error: Token missing or invalid format (Expected 'Bearer [token]')" 
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded; 
        
        next();

    } catch (err) {
        // Handle invalid token 
        console.error('Token Verification Failed:', err.message);
        return res.status(401).json({ message: 'Authentication error: Invalid or expired token.' });
    }
};

// --- 2. Manager Route Protection (protectManagerRoute) ---
// Checks for a valid token AND ensures the user's role is 'Manager'
const protectManagerRoute = (req, res, next) => {
    // 1. First, run the general token protection
    protectRoute(req, res, () => {
        // This callback only runs if the token was valid.
        
        // 2. Now check the user's role
        if (req.user && (req.user.role === 'Manager' || req.user.role === 'CEO')) {
            // User is authorized as a Manager/CEO
            next();
        } else {
            // User is logged in but does not have the manager role
            console.warn(`Authorization Failed: User ID ${req.user.User_ID} attempted to access Manager route without Manager role.`);
            return res.status(403).json({ 
                message: "Authorization denied. You must be a Manager or CEO to access this resource." 
            });
        }
    });
};


module.exports = {
    protectRoute,
    protectManagerRoute 
};