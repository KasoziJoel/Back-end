const express = require("express");
const router = express.Router();
// Assuming authController.js is in the parent directory (controllers)
// The correct relative path is almost certainly `../authController`
// If this still fails, try explicitly navigating:
// const authController = require("../authController.js"); // Adding the extension might help VSCode resolve it.
const authController = require("../authController.js"); 

// Login Route: Maps the path to the login function
router.post("/login", authController.login);

// Registration Route: Maps the path to the registerUser function
router.post("/register", authController.registerUser);

module.exports = router;