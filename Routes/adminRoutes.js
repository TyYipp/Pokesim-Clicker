const express = require("express");
const router = express.Router();
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// Admin dashboard route
router.get("/", isAuthenticated, isAdmin, adminController.dashboard);

// Admin route to manage users
router.get("/users", isAuthenticated, isAdmin, adminController.manageUsers);

// Admin route to manage Pokémon
router.get("/pokemon", isAuthenticated, isAdmin, adminController.managePokemon);

module.exports = router;
