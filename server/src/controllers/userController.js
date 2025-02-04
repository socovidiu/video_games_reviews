//handling authentication routes
const { User  } = require('../models/game');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');
const { tokenBlacklist } = require("../utils/tokenBlacklist");

// Get the JSON Web Token for authentication
const JWT_SECRET = process.env.JWT_SECRET;

// User Signup
const userSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, bio, role } = req.body;
    
    try {
        //check if the email is already used for a signup
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        //store the encrypted password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, bio, role });

        res.status(201).json({ message: 'User created successfully', user: { id: user.id, username: user.username, email: user.email } });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// User Login
const userLogin = async (req, res) => {
    //Extracts the validation errors of an express request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        //search for user in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        //create a JSON Web Token, authetication that will expire after 1h
        const token = jwt.sign({ Id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        // console.debug("Users want to login. Token: \n", token);
        // Send token to the client
        // console.debug(user)
        res.status(200).json({
            token,
            user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            },
        });

        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//user Logout
const userLogout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(400).json({ message: "No token provided" });
        }

        // Add token to a blacklist (if you want to invalidate it)
        tokenBlacklist.add(token);

        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Failed to logout" });
    }
}

// Returns the details of the user
const getAuthenticatedUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token
    
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. No token provided.' });
    }
    
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const id = decoded.Id;
        // Fetch user details based on token payload
        const user = await User.findOne({ where: { id }, });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        // Send user data back
        res.json({ user: { username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to authenticate token.' });
    }
};
  


module.exports = { userSignup, userLogin, userLogout, getAuthenticatedUser };