const multer = require('multer');
const { ApiError } = require('../utils/ApiError');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only image files are allowed'), false);
    }
};

// Configure upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    }
});

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            throw new ApiError(400, 'File size too large. Maximum 5MB allowed.');
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            throw new ApiError(400, 'Too many files. Only 1 file allowed.');
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            throw new ApiError(400, 'Unexpected field name for file upload.');
        }
    }
    next(error);
};

module.exports = { upload, handleMulterError };