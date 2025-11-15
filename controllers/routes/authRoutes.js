const express = require("express");
const router = express.Router();
// FINAL PATH: Go up two levels (from 'routes' to 'controllers', then to 'Back-end' root)
// This path works if authController.js is directly inside the 'Back-end' root folder.
const authController = require("./authController");

// Login Route: Maps the path to the login function
router.post("/login", authController.login);

// Registration Route: Maps the path to the registerUser function
router.post("/register", authController.registerUser);

module.exports = router;
