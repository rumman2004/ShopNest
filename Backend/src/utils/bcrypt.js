const bcrypt = require('bcryptjs');
const { ApiError } = require('./ApiError');

class BcryptUtils {
    /**
     * Hash a password
     * @param {string} password - Plain text password
     * @param {number} saltRounds - Number of salt rounds (default: 12)
     * @returns {Promise<string>} - Hashed password
     */
    static async hashPassword(password, saltRounds = 12) {
        try {
            if (!password) {
                throw new ApiError(400, 'Password is required');
            }

            if (typeof password !== 'string') {
                throw new ApiError(400, 'Password must be a string');
            }

            if (password.length < 8) {
                throw new ApiError(400, 'Password must be at least 8 characters long');
            }

            const salt = await bcrypt.genSalt(saltRounds);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to hash password');
        }
    }

    /**
     * Compare password with hash
     * @param {string} password - Plain text password
     * @param {string} hash - Hashed password
     * @returns {Promise<boolean>} - Comparison result
     */
    static async comparePassword(password, hash) {
        try {
            if (!password || !hash) {
                return false;
            }

            return await bcrypt.compare(password, hash);
        } catch (error) {
            console.error('Password comparison error:', error);
            return false;
        }
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {object} - Validation result with strength score and suggestions
     */
    static validatePasswordStrength(password) {
        const result = {
            isValid: false,
            score: 0,
            suggestions: [],
            strength: 'weak'
        };

        if (!password || typeof password !== 'string') {
            result.suggestions.push('Password is required');
            return result;
        }

        // Length check
        if (password.length < 8) {
            result.suggestions.push('Use at least 8 characters');
        } else if (password.length >= 12) {
            result.score += 2;
        } else {
            result.score += 1;
        }

        // Lowercase check
        if (!/[a-z]/.test(password)) {
            result.suggestions.push('Include lowercase letters');
        } else {
            result.score += 1;
        }

        // Uppercase check
        if (!/[A-Z]/.test(password)) {
            result.suggestions.push('Include uppercase letters');
        } else {
            result.score += 1;
        }

        // Number check
        if (!/\d/.test(password)) {
            result.suggestions.push('Include numbers');
        } else {
            result.score += 1;
        }

        // Special character check
        if (!/[@$!%*?&]/.test(password)) {
            result.suggestions.push('Include special characters (@$!%*?&)');
        } else {
            result.score += 1;
        }

        // Common patterns check
        const commonPatterns = ['123456', 'password', 'qwerty', 'abc123'];
        if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
            result.suggestions.push('Avoid common password patterns');
            result.score -= 1;
        }

        // Determine strength
        if (result.score >= 5) {
            result.strength = 'strong';
            result.isValid = true;
        } else if (result.score >= 3) {
            result.strength = 'medium';
            result.isValid = password.length >= 8;
        } else {
            result.strength = 'weak';
        }

        return result;
    }

    /**
     * Generate a secure random password
     * @param {number} length - Password length (default: 12)
     * @param {object} options - Generation options
     * @returns {string} - Generated password
     */
    static generateSecurePassword(length = 12, options = {}) {
        const {
            includeUppercase = true,
            includeLowercase = true,
            includeNumbers = true,
            includeSpecialChars = true,
            excludeAmbiguous = true
        } = options;

        let chars = '';
        
        if (includeLowercase) {
            chars += excludeAmbiguous ? 'abcdefghijkmnopqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        }
        
        if (includeUppercase) {
            chars += excludeAmbiguous ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        
        if (includeNumbers) {
            chars += excludeAmbiguous ? '23456789' : '0123456789';
        }
        
        if (includeSpecialChars) {
            chars += '@$!%*?&';
        }

        if (!chars) {
            throw new ApiError(400, 'At least one character type must be included');
        }

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return password;
    }
}

module.exports = { BcryptUtils };