const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateJWT = async (req, res, next) => {
  const token = req.cookies.token; // ✅ read token from cookie

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // Attach full user object (optional)
    req.role = user.role; // Attach role if needed
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Unauthorized role.' });
    }
    next();
  };
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
