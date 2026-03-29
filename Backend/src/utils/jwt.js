const jwt = require('jsonwebtoken');
const { ApiError } = require('./ApiError');

class JWTUtils {
    /**
     * Generate access token
     * @param {object} payload - Token payload
     * @param {string} expiresIn - Token expiration (default from env)
     * @returns {string} - JWT token
     */
    static generateAccessToken(payload, expiresIn = process.env.JWT_EXPIRES_IN) {
        try {
            if (!process.env.JWT_SECRET) {
                throw new ApiError(500, 'JWT secret not configured');
            }

            return jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn,
                issuer: 'shopnest-api',
                audience: 'shopnest-client'
            });
        } catch (error) {
            console.error('JWT generation error:', error);
            throw new ApiError(500, 'Token generation failed');
        }
    }

    /**
     * Generate refresh token
     * @param {object} payload - Token payload
     * @param {string} expiresIn - Token expiration (default from env)
     * @returns {string} - JWT refresh token
     */
    static generateRefreshToken(payload, expiresIn = process.env.JWT_REFRESH_EXPIRES_IN) {
        try {
            if (!process.env.JWT_REFRESH_SECRET) {
                throw new ApiError(500, 'JWT refresh secret not configured');
            }

            return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
                expiresIn,
                issuer: 'shopnest-api',
                audience: 'shopnest-client'
            });
        } catch (error) {
            console.error('JWT refresh token generation error:', error);
            throw new ApiError(500, 'Refresh token generation failed');
        }
    }

    /**
     * Generate both access and refresh tokens
     * @param {object} payload - Token payload
     * @returns {object} - Both tokens
     */
    static generateTokens(payload) {
        return {
            accessToken: this.generateAccessToken(payload),
            refreshToken: this.generateRefreshToken(payload)
        };
    }

    /**
     * Verify access token
     * @param {string} token - JWT token to verify
     * @returns {object} - Decoded token payload
     */
    static verifyAccessToken(token) {
        try {
            if (!token) {
                throw new ApiError(401, 'Access token is required');
            }

            if (!process.env.JWT_SECRET) {
                throw new ApiError(500, 'JWT secret not configured');
            }

            return jwt.verify(token, process.env.JWT_SECRET, {
                issuer: 'shopnest-api',
                audience: 'shopnest-client'
            });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, 'Invalid access token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Access token expired');
            }
            if (error.name === 'NotBeforeError') {
                throw new ApiError(401, 'Access token not active yet');
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(401, 'Token verification failed');
        }
    }

    /**
     * Verify refresh token
     * @param {string} token - JWT refresh token to verify
     * @returns {object} - Decoded token payload
     */
    static verifyRefreshToken(token) {
        try {
            if (!token) {
                throw new ApiError(401, 'Refresh token is required');
            }

            if (!process.env.JWT_REFRESH_SECRET) {
                throw new ApiError(500, 'JWT refresh secret not configured');
            }

            return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
                issuer: 'shopnest-api',
                audience: 'shopnest-client'
            });
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                throw new ApiError(401, 'Invalid refresh token');
            }
            if (error.name === 'TokenExpiredError') {
                throw new ApiError(401, 'Refresh token expired');
            }
            if (error.name === 'NotBeforeError') {
                throw new ApiError(401, 'Refresh token not active yet');
            }
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(401, 'Refresh token verification failed');
        }
    }

    /**
     * Decode token without verification (for debugging)
     * @param {string} token - JWT token to decode
     * @returns {object} - Decoded token
     */
    static decodeToken(token) {
        try {
            return jwt.decode(token, { complete: true });
        } catch (error) {
            console.error('Token decode error:', error);
            return null;
        }
    }

    /**
     * Get token expiration time
     * @param {string} token - JWT token
     * @returns {Date|null} - Expiration date
     */
    static getTokenExpiration(token) {
        try {
            const decoded = jwt.decode(token);
            if (decoded && decoded.exp) {
                return new Date(decoded.exp * 1000);
            }
            return null;
        } catch (error) {
            console.error('Token expiration check error:', error);
            return null;
        }
    }

    /**
     * Check if token is expired
     * @param {string} token - JWT token
     * @returns {boolean} - Whether token is expired
     */
    static isTokenExpired(token) {
        try {
            const expiration = this.getTokenExpiration(token);
            if (!expiration) return true;
            return expiration < new Date();
        } catch (error) {
            return true;
        }
    }

    /**
     * Get time remaining until token expires
     * @param {string} token - JWT token
     * @returns {number} - Milliseconds until expiration
     */
    static getTimeUntilExpiration(token) {
        try {
            const expiration = this.getTokenExpiration(token);
            if (!expiration) return 0;
            return Math.max(0, expiration.getTime() - new Date().getTime());
        } catch (error) {
            return 0;
        }
    }

    /**
     * Extract bearer token from authorization header
     * @param {string} authHeader - Authorization header value
     * @returns {string|null} - Extracted token
     */
    static extractBearerToken(authHeader) {
        if (!authHeader || typeof authHeader !== 'string') {
            return null;
        }

        if (!authHeader.startsWith('Bearer ')) {
            return null;
        }

        return authHeader.substring(7); // Remove 'Bearer ' prefix
    }

    /**
     * Create token payload for user
     * @param {object} user - User object
     * @param {string} userType - User type ('owner' or 'cashier')
     * @returns {object} - Token payload
     */
    static createUserPayload(user, userType) {
        const basePayload = {
            id: user.id || user.owner_id || user.cashier_id,
            type: userType,
            iat: Math.floor(Date.now() / 1000)
        };

        if (userType === 'owner') {
            return {
                ...basePayload,
                email: user.email
            };
        } else if (userType === 'cashier') {
            return {
                ...basePayload,
                username: user.username,
                shop_id: user.shop_id
            };
        }

        return basePayload;
    }

    /**
     * Generate secure random string for token secrets
     * @param {number} length - Length of the random string
     * @returns {string} - Random string
     */
    static generateSecureSecret(length = 64) {
        const crypto = require('crypto');
        return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
    }
}

module.exports = { JWTUtils };