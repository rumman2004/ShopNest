const { ApiError } = require('../utils/ApiError');

const validate = (schema) => {
    return (req, res, next) => {
        const validationResults = {};

        // Validate params
        if (schema.params) {
            const { error, value } = schema.params.validate(req.params);
            if (error) {
                throw new ApiError(400, error.details[0].message);
            }
            validationResults.params = value;
        }

        // Validate query
        if (schema.query) {
            const { error, value } = schema.query.validate(req.query);
            if (error) {
                throw new ApiError(400, error.details[0].message);
            }
            validationResults.query = value;
        }

        // Validate body
        if (schema.body) {
            const { error, value } = schema.body.validate(req.body);
            if (error) {
                throw new ApiError(400, error.details[0].message);
            }
            validationResults.body = value;
        }

        // Update request objects with validated values
        if (validationResults.params) req.params = validationResults.params;
        if (validationResults.query) req.query = validationResults.query;
        if (validationResults.body) req.body = validationResults.body;

        next();
    };
};

module.exports = { validate };