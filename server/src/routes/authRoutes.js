const express = require('express');
const { userSignup, userLogin, userLogout, getAuthenticatedUser, updateUserProfile } = require('../controllers/userController');
const { body }  = require('express-validator');
const authenticateToken = require('../middleware/authMiddleware');
const authorizeRoles= require('../middleware/rolesMiddleware');
const upload = require("../middleware/upload"); 

const router = express.Router();

// User Signup
router.post('/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ],
    upload.single("profilePicture"),
    userSignup
);
  
// User Log in
router.post('/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    userLogin
);

// User Log out
router.post('/logout', userLogout);


// Example route for admins only
router.get('/admin',authenticateToken, authorizeRoles('admin'), (req, res) => {
    res.json({ message: 'Welcome, Admin!' });
});

// Protected route to get user details
router.get("/me", authenticateToken, getAuthenticatedUser);

// Update user profile
router.put(
    "/update-profile",
    authenticateToken, // Ensures only logged-in users can update
    upload.single("profilePicture"), // Handles profile picture upload
    updateUserProfile
);


module.exports = router;