const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

module.exports = {
  generateToken: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }),
  verifyToken: (token) => jwt.verify(token, JWT_SECRET),
};