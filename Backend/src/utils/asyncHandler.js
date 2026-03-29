/**
 * Wrapper function to handle async operations and catch errors
 * Eliminates the need for try-catch blocks in controllers
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


/**
 * Wrapper for database operations with error handling
 */
const asyncDB = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            // Log database errors for debugging
            console.error('Database Error:', error);
            throw error;
        }
    };
};

/**
 * Wrapper for service operations
 */
const asyncService = (fn) => {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            // Add context to service errors
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            throw error;
        }
    };
};

module.exports = { 
    asyncHandler, 
    asyncDB, 
    asyncService 
};