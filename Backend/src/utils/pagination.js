const { ApiError } = require('./ApiError');

class PaginationUtils {
    /**
     * Calculate pagination metadata
     * @param {number} page - Current page number
     * @param {number} limit - Items per page
     * @param {number} totalItems - Total number of items
     * @returns {object} - Pagination metadata
     */
    static getPaginationMeta(page, limit, totalItems) {
        // Validate inputs
        if (page < 1) {
            throw new ApiError(400, 'Page number must be greater than 0');
        }

        if (limit < 1 || limit > 100) {
            throw new ApiError(400, 'Limit must be between 1 and 100');
        }

        if (totalItems < 0) {
            throw new ApiError(400, 'Total items cannot be negative');
        }

        const totalPages = Math.ceil(totalItems / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const offset = (page - 1) * limit;

        return {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
            offset,
            startIndex: offset + 1,
            endIndex: Math.min(offset + limit, totalItems)
        };
    }

    /**
     * Create paginated response
     * @param {Array} data - Data array
     * @param {number} page - Current page number
     * @param {number} limit - Items per page
     * @param {number} totalItems - Total number of items
     * @param {string} message - Response message
     * @returns {object} - Paginated response
     */
    static createPaginatedResponse(data, page, limit, totalItems, message = 'Data retrieved successfully') {
        const pagination = this.getPaginationMeta(page, limit, totalItems);

        return {
            success: true,
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Validate pagination parameters
     * @param {object} query - Query parameters
     * @returns {object} - Validated and normalized parameters
     */
    static validatePaginationParams(query) {
        let { page = 1, limit = 10 } = query;

        // Convert to numbers
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        // Validate page
        if (isNaN(page) || page < 1) {
            throw new ApiError(400, 'Page must be a positive integer');
        }

        // Validate limit
        if (isNaN(limit) || limit < 1 || limit > 100) {
            throw new ApiError(400, 'Limit must be between 1 and 100');
        }

        return { page, limit };
    }

    /**
     * Get SQL LIMIT and OFFSET values
     * @param {number} page - Current page number
     * @param {number} limit - Items per page
     * @returns {object} - SQL pagination values
     */
    static getSqlPagination(page, limit) {
        const offset = (page - 1) * limit;
        return { limit, offset };
    }

    /**
     * Create pagination links for API
     * @param {string} baseUrl - Base URL for the API endpoint
     * @param {object} pagination - Pagination metadata
     * @param {object} additionalParams - Additional query parameters
     * @returns {object} - Pagination links
     */
    static createPaginationLinks(baseUrl, pagination, additionalParams = {}) {
        const { currentPage, totalPages, hasNextPage, hasPrevPage } = pagination;
        const params = new URLSearchParams(additionalParams);

        const createLink = (page) => {
            params.set('page', page);
            return `${baseUrl}?${params.toString()}`;
        };

        const links = {
            self: createLink(currentPage),
            first: createLink(1),
            last: createLink(totalPages)
        };

        if (hasPrevPage) {
            links.prev = createLink(currentPage - 1);
        }

        if (hasNextPage) {
            links.next = createLink(currentPage + 1);
        }

        return links;
    }

    /**
     * Get page range for pagination navigation
     * @param {number} currentPage - Current page number
     * @param {number} totalPages - Total number of pages
     * @param {number} maxPages - Maximum pages to show (default: 10)
     * @returns {Array} - Array of page numbers to display
     */
    static getPageRange(currentPage, totalPages, maxPages = 10) {
        if (totalPages <= maxPages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const halfRange = Math.floor(maxPages / 2);
        let startPage = Math.max(1, currentPage - halfRange);
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        // Adjust if we're near the end
        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }

    /**
     * Calculate items to skip for cursor-based pagination
     * @param {string} cursor - Cursor value (typically an ID or timestamp)
     * @param {string} direction - Direction ('after' or 'before')
     * @param {number} limit - Items per page
     * @returns {object} - Cursor pagination parameters
     */
    static getCursorPagination(cursor, direction = 'after', limit = 10) {
        if (limit < 1 || limit > 100) {
            throw new ApiError(400, 'Limit must be between 1 and 100');
        }

        return {
            cursor,
            direction,
            limit,
            operator: direction === 'after' ? '>' : '<',
            orderDirection: direction === 'after' ? 'ASC' : 'DESC'
        };
    }

    /**
     * Create cursor-based pagination response
     * @param {Array} data - Data array
     * @param {number} limit - Items per page
     * @param {string} cursorField - Field name used for cursor
     * @returns {object} - Cursor paginated response
     */
    static createCursorResponse(data, limit, cursorField = 'id') {
        const hasMore = data.length > limit;
        const items = hasMore ? data.slice(0, -1) : data;
        
        const response = {
            success: true,
            data: items,
            hasMore,
            timestamp: new Date().toISOString()
        };

        if (items.length > 0) {
            response.cursors = {
                before: items[0][cursorField],
                after: items[items.length - 1][cursorField]
            };
        }

        return response;
    }

    /**
     * Get pagination summary text
     * @param {object} pagination - Pagination metadata
     * @returns {string} - Human readable pagination summary
     */
    static getPaginationSummary(pagination) {
        const { startIndex, endIndex, totalItems } = pagination;
        
        if (totalItems === 0) {
            return 'No items found';
        }
        
        if (totalItems === 1) {
            return '1 item';
        }
        
        return `Showing ${startIndex}-${endIndex} of ${totalItems} items`;
    }
}

module.exports = { PaginationUtils };