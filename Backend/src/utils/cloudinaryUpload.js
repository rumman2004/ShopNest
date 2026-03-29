const cloudinary = require('../config/cloudinary');
const { ApiError } = require('./ApiError');

class CloudinaryUtils {
    /**
     * Upload image to Cloudinary
     * @param {Buffer} imageBuffer - Image buffer from multer
     * @param {object} options - Upload options
     * @returns {Promise<object>} - Upload result
     */
    static async uploadImage(imageBuffer, options = {}) {
        const {
            folder = 'shopnest/products',
            width = 800,
            height = 800,
            crop = 'fill',
            quality = 'auto',
            format = 'auto'
        } = options;

        try {
            const uploadOptions = {
                resource_type: 'image',
                folder,
                transformation: [
                    { width, height, crop },
                    { quality, format }
                ],
                use_filename: false,
                unique_filename: true
            };

            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    uploadOptions,
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(new ApiError(500, 'Image upload failed'));
                        } else {
                            resolve({
                                public_id: result.public_id,
                                url: result.secure_url,
                                width: result.width,
                                height: result.height,
                                format: result.format,
                                bytes: result.bytes
                            });
                        }
                    }
                );
                uploadStream.end(imageBuffer);
            });
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new ApiError(500, 'Image upload failed');
        }
    }

    /**
     * Upload multiple images to Cloudinary
     * @param {Array} imageBuffers - Array of image buffers
     * @param {object} options - Upload options
     * @returns {Promise<Array>} - Array of upload results
     */
    static async uploadMultipleImages(imageBuffers, options = {}) {
        try {
            const uploadPromises = imageBuffers.map(buffer => 
                this.uploadImage(buffer, options)
            );
            return await Promise.all(uploadPromises);
        } catch (error) {
            throw new ApiError(500, 'Multiple image upload failed');
        }
    }

    /**
     * Delete image from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<object>} - Deletion result
     */
    static async deleteImage(publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            return result;
        } catch (error) {
            console.error('Cloudinary delete error:', error);
            throw new ApiError(500, 'Image deletion failed');
        }
    }

    /**
     * Delete multiple images from Cloudinary
     * @param {Array} publicIds - Array of Cloudinary public IDs
     * @returns {Promise<object>} - Deletion result
     */
    static async deleteMultipleImages(publicIds) {
        try {
            const result = await cloudinary.api.delete_resources(publicIds);
            return result;
        } catch (error) {
            console.error('Cloudinary bulk delete error:', error);
            throw new ApiError(500, 'Multiple image deletion failed');
        }
    }

    /**
     * Get image details from Cloudinary
     * @param {string} publicId - Cloudinary public ID
     * @returns {Promise<object>} - Image details
     */
    static async getImageDetails(publicId) {
        try {
            const result = await cloudinary.api.resource(publicId);
            return {
                public_id: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
                format: result.format,
                bytes: result.bytes,
                created_at: result.created_at
            };
        } catch (error) {
            console.error('Cloudinary get details error:', error);
            throw new ApiError(500, 'Failed to get image details');
        }
    }

    /**
     * Generate transformation URL
     * @param {string} publicId - Cloudinary public ID
     * @param {object} transformations - Transformation options
     * @returns {string} - Transformed image URL
     */
    static generateTransformationUrl(publicId, transformations = {}) {
        try {
            return cloudinary.url(publicId, {
                secure: true,
                ...transformations
            });
        } catch (error) {
            console.error('Cloudinary transformation error:', error);
            throw new ApiError(500, 'Failed to generate transformation URL');
        }
    }

    /**
     * Extract public ID from Cloudinary URL
     * @param {string} url - Cloudinary URL
     * @returns {string} - Public ID
     */
    static extractPublicId(url) {
        try {
            if (!url || typeof url !== 'string') {
                return null;
            }

            const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
            return matches ? matches[1] : null;
        } catch (error) {
            console.error('Error extracting public ID:', error);
            return null;
        }
    }

    /**
     * Validate image file
     * @param {object} file - Multer file object
     * @returns {boolean} - Validation result
     */
    static validateImageFile(file) {
        if (!file) {
            throw new ApiError(400, 'No file provided');
        }

        // Check file size (5MB limit)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new ApiError(400, 'File size too large. Maximum 5MB allowed');
        }

        // Check file type
        const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedMimes.includes(file.mimetype)) {
            throw new ApiError(400, 'Invalid file type. Only JPEG, PNG, and WebP allowed');
        }

        return true;
    }
}

module.exports = { CloudinaryUtils };