const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth'); // ✅ fixed name
dotenv.config();

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    user = new User({
      name,
      email,
      password,  // raw password here; hash handled by pre-save hook in User model
      slug,
      role: 'user' // default role
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
router.post('/login', userController.loginUser);

// ✅ Use isAuthenticated middleware from auth.js
router.post('/add-pokemon', isAuthenticated, userController.addPokemonToUser);
router.get('/me', isAuthenticated, userController.getUserWithPokemons);
router.post('/remove-pokemon', isAuthenticated, userController.removePokemonFromUser);
router.post('/add-random-pokemon', isAuthenticated, userController.addRandomPokemonToUser);

module.exports = router;
