const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Apply auth middlewares to all admin routes
router.use(isAuthenticated);
router.use(isAdmin);

// Admin dashboard
router.get('/', adminController.dashboard);

// Manage users
router.get('/users', adminController.manageUsers);

// Manage Pokemon
router.get('/pokemon', adminController.managePokemon);

module.exports = router;
