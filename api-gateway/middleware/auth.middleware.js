const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; 

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded; 
  } catch (e) {
    console.warn('JWT verification failed:', e.message);
  }

  next();
};

function verifyToken(token) {
  return jwt.verify(token, secret);
}
