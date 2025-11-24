import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { logger } from './config/logger';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

/**
 * Create and configure Express application
 */
export function createApp(): Application {
    const app = express();

    // Security middleware
    app.use(helmet());

    // CORS configuration
    app.use(
        cors({
            origin: env.FRONTEND_URL === '*' ? true : env.FRONTEND_URL,
            credentials: true,
            optionsSuccessStatus: 200,
        })
    );

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging
    if (env.NODE_ENV !== 'test') {
        app.use(
            morgan('combined', {
                stream: {
                    write: (message: string) => logger.info(message.trim()),
                },
            })
        );
    }

    // Rate limiting
    app.use(apiLimiter);

    // API routes
    app.use(env.API_PREFIX, routes);

    // 404 handler
    app.use(notFoundHandler);

    // Global error handler (must be last)
    app.use(errorHandler);

    return app;
}
