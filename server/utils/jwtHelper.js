const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
  generateToken: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }),
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
};


module.exports.verifyToken = (req, res, next) => {
    try {
      const token = req.cookies.authToken; // Retrieve token from the cookie
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user data to request object
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  };