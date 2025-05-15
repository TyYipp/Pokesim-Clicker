const jwt = require('jsonwebtoken');
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
      // No token found - set user null and continue so public routes work
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token Payload:', decoded);

    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('ownedPokemons');

    if (!user) {
      // User not found - unauthorized
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      userId: user._id.toString(),
      name: user.name,      // use `name` here for consistency
      role: user.role,
      ownedPokemons: user.ownedPokemons,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    // For invalid token, just clear user and continue (optional)
    req.user = null;
    // Optionally, you can block access on invalid token by uncommenting:
    // return res.status(401).json({ message: 'Unauthorized', error: error.message });
    next();
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
