//Use the middleware to protect routes that require authentication.
const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, ${req.user.username}!`, user: req.user });
  });

module.exports = router;