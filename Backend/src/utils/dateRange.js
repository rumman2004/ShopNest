const { ApiError } = require('./ApiError');

class DateRangeUtils {
    /**
     * Get date range based on predefined periods
     * @param {string} period - Period string (7d, 30d, 90d, 1y, etc.)
     * @returns {object} - Start and end dates
     */
    static getDateRange(period) {
        const endDate = new Date();
        const startDate = new Date();

        switch (period.toLowerCase()) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
            case 'yesterday':
                startDate.setDate(startDate.getDate() - 1);
                startDate.setHours(0, 0, 0, 0);
                endDate.setDate(endDate.getDate() - 1);
                endDate.setHours(23, 59, 59, 999);
                break;
            case '7d':
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
            case 'month':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '90d':
            case 'quarter':
                startDate.setDate(endDate.getDate() - 90);
                break;
            case '180d':
            case '6m':
                startDate.setDate(endDate.getDate() - 180);
                break;
            case '1y':
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
            case 'mtd': // Month to date
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'ytd': // Year to date
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
            default:
                // If period is not recognized, default to last 7 days
                startDate.setDate(endDate.getDate() - 7);
        }

        return {
            start_date: this.formatDate(startDate),
            end_date: this.formatDate(endDate),
            startDate,
            endDate
        };
    }

        /**
     * Get previous period dates for comparison
     * @param {Date} startDate - Current period start date
     * @param {Date} endDate - Current period end date
     * @returns {object} - Previous period start and end dates
     */
    static getPreviousPeriod(startDate, endDate) {
        const currentStart = new Date(startDate);
        const currentEnd = new Date(endDate);
        
        // Calculate the duration of the current period
        const durationMs = currentEnd.getTime() - currentStart.getTime();
        
        // Calculate previous period dates
        const prevEnd = new Date(currentStart.getTime() - 1);
        const prevStart = new Date(prevEnd.getTime() - durationMs);
        
        return {
            start_date: this.formatDate(prevStart),
            end_date: this.formatDate(prevEnd),
            startDate: prevStart,
            endDate: prevEnd
        };
    }

    /**
     * Format date to YYYY-MM-DD string
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date string
     */
    static formatDate(date) {
        if (!date || !(date instanceof Date)) {
            throw new ApiError(400, 'Invalid date provided');
        }
        return date.toISOString().split('T')[0];
    }

    /**
     * Format date to YYYY-MM-DD HH:mm:ss string
     * @param {Date} date - Date to format
     * @returns {string} - Formatted datetime string
     */
    static formatDateTime(date) {
        if (!date || !(date instanceof Date)) {
            throw new ApiError(400, 'Invalid date provided');
        }
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }

    /**
     * Validate date string format
     * @param {string} dateString - Date string to validate
     * @param {string} format - Expected format ('YYYY-MM-DD' or 'YYYY-MM-DD HH:mm:ss')
     * @returns {boolean} - Validation result
     */
    static validateDateFormat(dateString, format = 'YYYY-MM-DD') {
        if (!dateString || typeof dateString !== 'string') {
            return false;
        }

        let regex;
        if (format === 'YYYY-MM-DD') {
            regex = /^\d{4}-\d{2}-\d{2}$/;
        } else if (format === 'YYYY-MM-DD HH:mm:ss') {
            regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
        } else {
            return false;
        }

        if (!regex.test(dateString)) {
            return false;
        }

        // Check if the date is valid
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Get date range for specific intervals (hourly, daily, weekly, monthly)
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @param {string} interval - Interval type
     * @returns {Array} - Array of date ranges
     */
    static getDateIntervals(startDate, endDate, interval = 'daily') {
        const intervals = [];
        const current = new Date(startDate);
        const end = new Date(endDate);

        while (current <= end) {
            const intervalStart = new Date(current);
            let intervalEnd;

            switch (interval.toLowerCase()) {
                case 'hourly':
                    intervalEnd = new Date(current);
                    intervalEnd.setHours(current.getHours() + 1);
                    current.setHours(current.getHours() + 1);
                    break;
                case 'daily':
                    intervalEnd = new Date(current);
                    intervalEnd.setDate(current.getDate() + 1);
                    current.setDate(current.getDate() + 1);
                    break;
                case 'weekly':
                    intervalEnd = new Date(current);
                    intervalEnd.setDate(current.getDate() + 7);
                    current.setDate(current.getDate() + 7);
                    break;
                case 'monthly':
                    intervalEnd = new Date(current);
                    intervalEnd.setMonth(current.getMonth() + 1);
                    current.setMonth(current.getMonth() + 1);
                    break;
                default:
                    throw new ApiError(400, 'Invalid interval type');
            }

            if (intervalEnd > end) {
                intervalEnd = new Date(end);
            }

            intervals.push({
                start: this.formatDateTime(intervalStart),
                end: this.formatDateTime(intervalEnd),
                startDate: intervalStart,
                endDate: intervalEnd
            });

            if (intervalEnd.getTime() === end.getTime()) break;
        }

        return intervals;
    }

    /**
     * Check if a date is within a range
     * @param {Date} date - Date to check
     * @param {Date} startDate - Range start date
     * @param {Date} endDate - Range end date
     * @returns {boolean} - Whether date is in range
     */
    static isDateInRange(date, startDate, endDate) {
        const checkDate = new Date(date);
        const rangeStart = new Date(startDate);
        const rangeEnd = new Date(endDate);

        return checkDate >= rangeStart && checkDate <= rangeEnd;
    }

    /**
     * Get business days between two dates (excluding weekends)
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {number} - Number of business days
     */
    static getBusinessDaysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        let businessDays = 0;
        const current = new Date(start);

        while (current <= end) {
            const dayOfWeek = current.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
                businessDays++;
            }
            current.setDate(current.getDate() + 1);
        }

        return businessDays;
    }

    /**
     * Get timezone offset string
     * @param {Date} date - Date to get timezone for
     * @returns {string} - Timezone offset string (e.g., '+05:30')
     */
    static getTimezoneOffset(date = new Date()) {
        const offset = date.getTimezoneOffset();
        const hours = Math.floor(Math.abs(offset) / 60);
        const minutes = Math.abs(offset) % 60;
        const sign = offset <= 0 ? '+' : '-';
        return `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    /**
     * Convert date to user timezone
     * @param {Date} date - UTC date
     * @param {string} timezone - Target timezone (e.g., 'Asia/Kolkata')
     * @returns {Date} - Converted date
     */
    static convertToTimezone(date, timezone) {
        try {
            return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
        } catch (error) {
            console.error('Timezone conversion error:', error);
            return date;
        }
    }
}

module.exports = { DateRangeUtils };