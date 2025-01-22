//handling authentication routes
const { User  } = require('../models/game');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');

// Get the JSON Web Token for authentication
const JWT_SECRET = process.env.JWT_SECRET;

// User Signup
const userSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    
    try {
        //check if the email is already used for a signup
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }
        //store the encrypted password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword });

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
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Login successful', token });
        } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { userSignup, userLogin };