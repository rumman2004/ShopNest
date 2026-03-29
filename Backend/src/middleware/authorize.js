const { ApiError } = require('../utils/ApiError');

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.type)) { // Changed 'role' to 'type'
            return next(new ApiError(403, `Access denied: ${req.user.type} role is not authorized`));
        }
        next();
    };
};

module.exports = authorize;