const { ApiError } = require('../utils/ApiError');

const errorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;

    // Handle MySQL errors
    if (error.code) {
        switch (error.code) {
            case 'ER_DUP_ENTRY':
                statusCode = 409;
                message = 'Duplicate entry found';
                break;
            case 'ER_NO_REFERENCED_ROW_2':
                statusCode = 404;
                message = 'Referenced record not found';
                break;
            case 'ER_ROW_IS_REFERENCED_2':
                statusCode = 409;
                message = 'Cannot delete record - it is being referenced by other records';
                break;
            case 'ER_DATA_TOO_LONG':
                statusCode = 400;
                message = 'Data too long for field';
                break;
            case 'ER_BAD_NULL_ERROR':
                statusCode = 400;
                message = 'Required field cannot be null';
                break;
            default:
                statusCode = 500;
                message = 'Database error occurred';
        }
    }

    // Handle Joi validation errors
    if (error.isJoi) {
        statusCode = 400;
        message = error.details[0].message;
    }

    // Log error for debugging (in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', error);
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

module.exports = { errorHandler };