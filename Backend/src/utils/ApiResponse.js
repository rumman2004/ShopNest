class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    static success(data, message = "Success", statusCode = 200) {
        return new ApiResponse(statusCode, data, message);
    }

    static created(data, message = "Created successfully") {
        return new ApiResponse(201, data, message);
    }

    static noContent(message = "No content") {
        return new ApiResponse(204, null, message);
    }

    static badRequest(message = "Bad request") {
        return new ApiResponse(400, null, message);
    }

    static unauthorized(message = "Unauthorized") {
        return new ApiResponse(401, null, message);
    }

    static forbidden(message = "Forbidden") {
        return new ApiResponse(403, null, message);
    }

    static notFound(message = "Not found") {
        return new ApiResponse(404, null, message);
    }

    static conflict(message = "Conflict") {
        return new ApiResponse(409, null, message);
    }

    static error(message = "Internal server error", statusCode = 500) {
        return new ApiResponse(statusCode, null, message);
    }

    // Method to send response
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
            timestamp: this.timestamp
        });
    }

    // Method to send paginated response
    static paginated(data, pagination, message = "Success") {
        return {
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = { ApiResponse };