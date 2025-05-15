const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.use(isAuthenticated);
router.use(isAdmin);

router.get('/', adminController.dashboard);
router.get('/users', adminController.manageUsers);
router.get('/pokemon', adminController.managePokemon);

module.exports = router;
