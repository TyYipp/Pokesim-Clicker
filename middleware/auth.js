const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports.isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Store user info in the request object
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

module.exports.isAdmin = (req, res, next) => {
  // Ensure the role is 'admin' in the decoded JWT payload
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};
