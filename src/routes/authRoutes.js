const express = require('express');
const { userSignup, userLogin } = require('../controllers/userController');
const { body }  = require('express-validator');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles= require('../middleware/rolesMiddleware');

const router = express.Router();

// User Signup
router.post('/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    userSignup
);
  
// User Login
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    userLogin
);

// Example route for admins only
router.get('/admin',authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
});

// All authenticated users can access
router.get('/user', authenticateToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.name}` });
});

module.exports = router;