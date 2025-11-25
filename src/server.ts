import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { testConnection, closeConnection } from './config/database';

/**
 * Start the server
 */
async function startServer() {
    try {
        // Test database connection
        logger.info('Testing database connection...');
        const isConnected = await testConnection();

        if (!isConnected) {
            logger.error('Failed to connect to database');
            process.exit(1);
        }

        logger.info('Database connection successful');

        // Create Express app
        const app = createApp();

        const port = process.env.PORT || 3000;

        // Start server
        const server = app.listen(port, () => {
            logger.info(`Server running on port ${port}`);
            logger.info(`Environment: ${env.NODE_ENV}`);
            logger.info(`API URL: http://localhost:${port}${env.API_PREFIX}`);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                logger.info('HTTP server closed');

                // Close database connection
                await closeConnection();
                logger.info('Database connection closed');

                process.exit(0);
            });

            // Force shutdown after 10 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();
