//handling authentication routes
const { User  } = require('../models/game');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult }= require('express-validator');
const { tokenBlacklist } = require("../utils/tokenBlacklist");

// Get the JSON Web Token for authentication
const JWT_SECRET = process.env.JWT_SECRET;
const baseUrl = process.env.SERVER_URL;
// User Signup
const userSignup = async (req, res) => {

    console.log("Received Signup Request:", req.body);
    console.log("Uploaded File:", req.file);

    const { username, email, password, bio } = req.body;
    
    //  Role must be set (assuming default is "user")
    const role = "user"; 

    //  Validation - Return only missing fields
    let errors = [];
    if (!username) errors.push({ msg: "Username is required", path: "username" });
    if (!email) errors.push({ msg: "Invalid email", path: "email" });
    if (!password || password.length < 6) errors.push({ msg: "Password must be at least 6 characters", path: "password" });

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    // Profile picture should be correctly set
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : "/default-avatar.jpg";

    try {
        // ✅ Check if email is already registered
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered" });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            bio,
            role,
            profilePicture,
        });

        console.debug("User Created:", newUser);
        return res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({ error: "Server error, please try again later." });
    }
};
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
            bio: user.bio,
            profilePicture: user.avatarUrl
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
        // Construct full image URL
        const profilePictureUrl = user.profilePicture 
            ? `${baseUrl}${user.profilePicture}` 
            : `${baseUrl}/uploads/Default_picture.jpg`;
        // Return user data
        res.status(200).json({ 
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                bio: user.bio,
                profilePicture: profilePictureUrl,
            }
        });   
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to authenticate token.' });
    }
};
  
//update user data
const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from token middleware
        const { username, email, bio } = req.body;

        // Find user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user details
        user.username = username || user.username;
        user.email = email || user.email;
        user.bio = bio || user.bio;

        // If a new profile picture is uploaded, update it
        if (req.file) {
            user.profilePicture = `/uploads/${req.file.filename}`;
        }

        await user.save();

        const profilePictureUrl = user.profilePicture 
        ? `${baseUrl}${user.profilePicture}` 
        : `${baseUrl}/uploads/Default_picture.jpg`;
        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                bio: user.bio,
                profilePicture: profilePictureUrl,
            },
        });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { userSignup, userLogin, userLogout, getAuthenticatedUser, updateUserProfile };