
/*
This function focuses on authorization, i.e., checking if the authenticated user has the required role(s) to access a specific resource.

Purpose:
     Ensures the user has the necessary permissions (based on their role) to perform an action or access a resource.

Functionality:
    Relies on the authenticated user's role, which is extracted via the authenticateToken middleware.
    Checks if the user's role matches any of the allowed roles for the resource.
*/

const ROLE_HIERARCHY = {
    admin: ['admin', 'user'], // Admins can do everything
    user: ['user'],           // Users have basic access
};
  
const authorizeRoles = (...requiredRoles) => { 
    return  (req, res, next) => {
    
        const userRole = req.user.role; // Assumes `authenticateToken` has added `req.user`

        if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next(); // User has the required role, proceed to the next middleware
    };
};

module.exports = authorizeRoles;