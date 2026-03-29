const express = require('express');
const authController = require('./auth.controller');
const authValidation = require('./auth.validation');
const { validate } = require('../../middleware/validate');
const { authenticate } = require('../../middleware/authenticate'); // Import authenticate

const router = express.Router();

// Owner registration
router.post('/register/owner', 
    validate(authValidation.registerOwner),
    authController.registerOwner
);

// Cashier registration (requires owner authentication)
router.post('/register/cashier',
    authenticate, // Require authentication
    validate(authValidation.registerCashier),
    authController.registerCashier
);

// Generic register route
router.post('/register',
    (req, res, next) => {
        if (req.body.email && !req.body.username) {
            validate(authValidation.registerOwner)(req, res, next);
        } else if (req.body.username && req.body.shop_id) {
            validate(authValidation.registerCashier)(req, res, next);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid registration data'
            });
        }
    },
    (req, res, next) => {
        if (req.body.email && !req.body.username) {
            authController.registerOwner(req, res, next);
        } else if (req.body.username && req.body.shop_id) {
            authController.registerCashier(req, res, next);
        }
    }
);

// Login (works for both owners and cashiers)
router.post('/login',
    validate(authValidation.login),
    authController.login
);

// Get current user info
router.get('/me',
    authenticate,
    authController.getMe
);

// Change password
router.put('/change-password',
    authenticate,
    validate(authValidation.changePassword),
    authController.changePassword
);

// Refresh token
router.post('/refresh',
    validate(authValidation.refreshToken),
    authController.refreshToken
);

// Logout
router.post('/logout',
    authController.logout
);

module.exports = router;