const express = require('express');
const { userSignup, userLogin } = require('../controllers/userController');
const { body }  = require('express-validator');

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

module.exports = router;