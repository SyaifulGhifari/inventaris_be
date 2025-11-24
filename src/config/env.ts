import { z } from 'zod';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Environment variables validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().transform(Number).default('3000'),
    API_PREFIX: z.string().default('/api'),

    // Database
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.string().transform(Number).default('5432'),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string().default('gudang_tekstil'),

    // JWT
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_EXPIRES_IN: z.string().default('24h'),

    // CORS
    FRONTEND_URL: z.union([z.literal('*'), z.string().url()]).default('http://localhost:3001'),

    // Logging
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
});

// Parse and validate environment variables
export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
