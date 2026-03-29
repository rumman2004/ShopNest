const mysql = require('mysql2/promise');
require('dotenv').config();

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    timezone: '+00:00',
    // Valid MySQL2 pool options only
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
    queueLimit: 0,
    // Remove these invalid options: acquireTimeout, timeout, reconnect
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false
    } : false
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

// Execute query with error handling
const execute = async (query, params = []) => {
    try {
        const [results] = await pool.execute(query, params);
        return [results];
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

// Get connection from pool
const getConnection = async () => {
    try {
        return await pool.getConnection();
    } catch (error) {
        console.error('Failed to get database connection:', error);
        throw error;
    }
};

// Close all connections
const closePool = async () => {
    try {
        await pool.end();
        console.log('🔌 Database connection pool closed');
    } catch (error) {
        console.error('Error closing database pool:', error);
    }
};

module.exports = {
    pool,
    execute,
    getConnection,
    testConnection,
    closePool
};