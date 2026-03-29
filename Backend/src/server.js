require('dotenv').config();
const app = require('./app');
const { testConnection, closePool } = require('./config/database');

const PORT = process.env.PORT || 5000;

// Test database connection
const initializeDatabase = async () => {
    try {
        const isConnected = await testConnection();
        if (!isConnected) {
            console.error('❌ Database connection failed. Exiting...');
            process.exit(1);
        }
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    }
};

// Start server
const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();
        
        // Start Express server
        const server = app.listen(PORT, () => {
            console.log('\n🚀 ShopNest POS API Server Started');
            console.log(`📍 Server running on: http://localhost:${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`📋 API Documentation: http://localhost:${PORT}/api/v1`);
            console.log(`💚 Health Check: http://localhost:${PORT}/health`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        });

        // Graceful shutdown handlers
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            
            server.close(async () => {
                console.log('🔴 HTTP server closed');
                
                // Close database connections
                await closePool();
                
                console.log('✅ Graceful shutdown completed');
                process.exit(0);
            });
            
            // Force close after 30 seconds
            setTimeout(() => {
                console.error('⚠️ Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        return server;
    } catch (error) {
        console.error('❌ Server startup failed:', error);
        process.exit(1);
    }
};

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
    console.log('🚨 UNHANDLED PROMISE REJECTION! 💥 Shutting down...');
    console.error('Reason:', reason);
    console.error('Promise:', promise);
    process.exit(1);
});

process.on('uncaughtException', (error) => {
    console.log('🚨 UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
});

// Start the server
startServer().catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});