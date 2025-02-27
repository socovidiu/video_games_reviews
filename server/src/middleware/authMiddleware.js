// To secure specific routes, create middleware to verify the JWT.
const jwt = require('jsonwebtoken');
const { isBlacklisted } = require("../utils/tokenBlacklist");
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/*
This function focuses on authentication, i.e., verifying the validity of the user's token to confirm their identity.

Purpose: Ensures the user is authenticated (logged in) and has provided a valid JWT.

Functionality:
  Decodes and verifies the JWT.
  Extracts the user's information (e.g., user ID, role) from the token.
  Attaches the user data to the req object for further use.
*/

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token is missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token || isBlacklisted(token)) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    // Explicitly assign req.user to avoid "undefined" issues
    req.user ={
      id: decoded.Id,
      username: decoded.username,
      role: decoded.role,
    };
    console.debug('The user data: ', req.user);
    next(); // Proceed to the next middleware
  } catch (err) {
    res.status(403).json({ message: 'Unauthorized: Invalid token' });
  }
};


module.exports = authenticateToken;