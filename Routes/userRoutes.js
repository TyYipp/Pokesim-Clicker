const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Ensure bcrypt is installed
const dotenv = require('dotenv');
dotenv.config();

// Register Route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input fields
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Ensure slug is generated
    const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
      slug,  // Ensure slug is included
    });

    // Save user to database
    await user.save();

    // Generate JWT token after successful registration
    const token = jwt.sign(
      { userId: user._id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Send success response with the token
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    console.log('Attempting to find user with email:', email);

    // Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password matches using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token after successful login
    const token = jwt.sign(
      { userId: user._id, username: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful. Token generated.');
    return res.json({
      message: 'Login successful',
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
