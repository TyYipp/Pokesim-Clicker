// middleware/auth.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader);

    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    console.log('Extracted Token:', token);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token Payload:', decoded);

    console.log('Finding user with ID:', decoded.userId);

    const user = await User.findById(new mongoose.Types.ObjectId(decoded.userId))
      .select('-password')
      .populate('ownedPokemons');

    console.log('User found:', user);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Assign only required info to req.user
    req.user = {
      userId: user._id.toString(),
      username: user.name,
      role: user.role,
      ownedPokemons: user.ownedPokemons,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Unauthorized', error: error.message });
  }
};

const isAdmin = (req, res, next) => {
  console.log('User info in isAdmin:', req.user);
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user found' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }
  next();
};

module.exports = { isAuthenticated, isAdmin };
