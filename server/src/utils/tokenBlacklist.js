// utils/tokenBlacklist.js
const tokenBlacklist = new Set();

// Add a token to the blacklist
function add(token) {
    tokenBlacklist.add(token);
}

// Check if a token is blacklisted
function isBlacklisted(token) {
    return tokenBlacklist.has(token);
}

module.exports = { tokenBlacklist, add, isBlacklisted };