// const jwt = require('jsonwebtoken');
// const secret = process.env.JWT_SECRET; 

// module.exports = (req, res, next) => {
//   const auth = req.headers.authorization || '';
//   const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

//   if (!token) {
//     return next();
//   }

//   try {
//     const decoded = verifyToken(token);
//     req.user = decoded; 
//   } catch (e) {
//     console.warn('JWT verification failed:', e.message);
//   }

//   next();
// };

// function verifyToken(token) {
//   return jwt.verify(token, secret);
// }


const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

const secret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.split(" ")[1] : null;

  if (!token) {
    throw new UnauthorizedError("Token missing. Access denied.");
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (err) {
    console.warn("JWT verification failed:", err.message);
    throw new UnauthorizedError("Invalid or expired token.");
  }
};
