# Product Requirement Document (PRD) - Backend
## Website Gudang Tekstil - Textile Inventory Management System

---

## Document Information

| Item | Detail |
|------|--------|
| **Project** | Website Gudang Tekstil - Backend API |
| **Version** | 1.0.0 |
| **Created Date** | 2025-11-24 |
| **Backend Team** | To be assigned |
| **Frontend Team** | Next.js (TypeScript) + shadcn/ui |
| **Tech Stack** | Express.js + Drizzle ORM + PostgreSQL |
| **Related Documents** | [Frontend PRD](./prdFE.md), [API Contract](./api-contract.md) |

---

## 1. Executive Summary

Backend API untuk Website Gudang Tekstil adalah sistem RESTful API yang dirancang untuk mendukung aplikasi manajemen inventaris tekstil. Sistem ini mengelola produk tekstil (Celana, Celana Jeans, Baju, Jaket) dengan fitur autentikasi, CRUD produk, filtering, pagination, dan dashboard statistik.

**Tech Stack:**
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** PostgreSQL (v14+)
- **ORM:** Drizzle ORM
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod
- **Security:** bcrypt, helmet, cors, rate-limiting

---

## 2. Project Goals

### 2.1 Business Goals
- Menyediakan API yang reliable dan performant untuk frontend Next.js
- Memastikan data integrity dan security untuk data inventaris tekstil
- Mendukung operasi CRUD yang cepat dan efisien
- Menyediakan filtering dan searching yang powerful untuk produk tekstil
- Implementasi autentikasi dan authorization yang aman

### 2.2 Technical Goals
- Response time < 200ms untuk GET requests
- Response time < 500ms untuk POST/PUT requests
- 99.9% uptime
- Scalable architecture untuk future enhancements
- Clean code dengan proper error handling
- Comprehensive API documentation
- Unit test coverage > 80%

---

## 3. Technical Architecture

### 3.1 Technology Stack

#### Core Framework
```
Express.js v4.18+
- Fast, unopinionated web framework
- Middleware support
- Easy routing
- Large ecosystem
```

#### Database & ORM
```
PostgreSQL v14+
- Reliable relational database
- ACID compliance
- JSON/JSONB support for arrays
- Excellent performance

Drizzle ORM
- Type-safe ORM
- SQL-like syntax
- Lightweight and fast
- Great TypeScript support
```

#### Authentication & Security
```
- jsonwebtoken: JWT token generation/validation
- bcrypt: Password hashing
- helmet: Security headers
- cors: Cross-origin resource sharing
- express-rate-limit: Rate limiting
- express-validator / Zod: Input validation
```

#### Development Tools
```
- TypeScript: Type safety
- tsx / ts-node: TypeScript execution
- dotenv: Environment variables
- morgan: HTTP request logger
- winston: Application logger
```

### 3.2 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts         # Drizzle database configuration
│   │   ├── env.ts              # Environment variables validation
│   │   └── logger.ts           # Winston logger setup
│   ├── db/
│   │   ├── schema/
│   │   │   ├── users.ts        # User table schema
│   │   │   ├── products.ts     # Product table schema
│   │   │   └── index.ts        # Export all schemas
│   │   ├── migrations/         # Database migrations
│   │   └── index.ts            # Database connection
│   ├── middleware/
│   │   ├── auth.ts             # JWT authentication middleware
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── rateLimiter.ts      # Rate limiting middleware
│   │   └── validator.ts        # Request validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts      # Authentication routes
│   │   ├── products.routes.ts  # Product routes
│   │   ├── dashboard.routes.ts # Dashboard routes
│   │   ├── categories.routes.ts # Category routes
│   │   └── index.ts            # Route aggregator
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── products.controller.ts
│   │   ├── dashboard.controller.ts
│   │   └── categories.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── products.service.ts
│   │   ├── dashboard.service.ts
│   │   └── token.service.ts
│   ├── utils/
│   │   ├── response.ts         # Standard response formatter
│   │   ├── errors.ts           # Custom error classes
│   │   └── constants.ts        # App constants
│   ├── types/
│   │   ├── express.d.ts        # Express type extensions
│   │   └── index.ts            # Shared types
│   ├── validators/
│   │   ├── auth.validator.ts
│   │   └── product.validator.ts
│   └── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── tests/
│   ├── unit/
│   ├── integration/
│   └── setup.ts
├── .env.example
├── .env.development
├── .env.production
├── drizzle.config.ts           # Drizzle configuration
├── package.json
├── tsconfig.json
└── README.md
```

---

## 4. Database Design

### 4.1 Database Schema (Drizzle ORM)

#### Users Table
```typescript
// src/db/schema/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('staff'), // admin, staff, manager
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

#### Products Table
```typescript
// src/db/schema/products.ts
import { pgTable, uuid, varchar, integer, numeric, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(), // Celana, Celana Jeans, Baju, Jaket
  sizes: jsonb('sizes').notNull(), // Array of sizes: ["S", "M", "L", "XL"]
  color: varchar('color', { length: 50 }).notNull(),
  material: varchar('material', { length: 100 }).notNull(),
  stock: integer('stock').notNull().default(0),
  price: numeric('price', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  imageUrl: varchar('image_url', { length: 500 }),
  createdBy: uuid('created_by').references(() => users.id),
  updatedBy: uuid('updated_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});
```

### 4.2 Database Indexes

**Critical indexes untuk performance:**

```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);

-- Products table indexes
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_color ON products(color);
CREATE INDEX idx_products_material ON products(material);
CREATE INDEX idx_products_stock ON products(stock);
CREATE INDEX idx_products_deleted_at ON products(deleted_at);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Composite indexes for common queries
CREATE INDEX idx_products_category_stock ON products(category, stock);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name));
```

### 4.3 Database Constraints

```sql
-- Category constraint
ALTER TABLE products ADD CONSTRAINT check_category 
  CHECK (category IN ('Celana', 'Celana Jeans', 'Baju', 'Jaket'));

-- Role constraint
ALTER TABLE users ADD CONSTRAINT check_role 
  CHECK (role IN ('admin', 'staff', 'manager'));

-- Stock constraint
ALTER TABLE products ADD CONSTRAINT check_stock 
  CHECK (stock >= 0);

-- Price constraint
ALTER TABLE products ADD CONSTRAINT check_price 
  CHECK (price > 0);
```

---

## 5. API Implementation Requirements

### 5.1 Authentication Endpoints

#### POST /api/auth/login
**Controller Logic:**
1. Validate email & password format (Zod)
2. Query user by email (case-insensitive)
3. Compare password with bcrypt
4. Generate JWT token (24h expiry)
5. Return user data + token

**Service Layer:**
```typescript
// auth.service.ts
async login(email: string, password: string) {
  // 1. Find user by email
  const user = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
  
  // 2. Verify password
  const isValid = await bcrypt.compare(password, user.password);
  
  // 3. Generate token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  
  // 4. Return user + token
  return { user, token };
}
```

#### POST /api/auth/logout
**Controller Logic:**
1. Verify JWT token
2. (Optional) Add token to blacklist/revoke
3. Return success message

#### GET /api/auth/me
**Controller Logic:**
1. Extract user from JWT middleware
2. Query fresh user data
3. Return user object

---

### 5.2 Product Endpoints

#### GET /api/products
**Controller Logic:**
1. Parse & validate query parameters (page, limit, search, filters)
2. Build dynamic SQL query with Drizzle
3. Apply filters (category, size, color, material)
4. Apply search (ILIKE on name)
5. Apply sorting
6. Execute query with pagination
7. Count total items
8. Return products + pagination metadata

**Query Builder Example:**
```typescript
// products.service.ts
async getProducts(filters: ProductFilters) {
  let query = db.select().from(products).where(isNull(products.deletedAt));
  
  // Apply filters
  if (filters.category) {
    query = query.where(eq(products.category, filters.category));
  }
  
  if (filters.search) {
    query = query.where(ilike(products.name, `%${filters.search}%`));
  }
  
  if (filters.color) {
    query = query.where(ilike(products.color, `%${filters.color}%`));
  }
  
  if (filters.material) {
    query = query.where(ilike(products.material, `%${filters.material}%`));
  }
  
  // Size filter (JSONB array contains)
  if (filters.size) {
    query = query.where(sql`${products.sizes} @> ${JSON.stringify([filters.size])}`);
  }
  
  // Sorting
  const orderBy = filters.sortBy === 'name' ? products.name : products.createdAt;
  query = filters.order === 'asc' ? query.orderBy(asc(orderBy)) : query.orderBy(desc(orderBy));
  
  // Pagination
  const offset = (filters.page - 1) * filters.limit;
  const results = await query.limit(filters.limit).offset(offset);
  
  // Count total
  const [{ count }] = await db.select({ count: sql`count(*)` }).from(products).where(isNull(products.deletedAt));
  
  return { products: results, total: count };
}
```

#### POST /api/products
**Controller Logic:**
1. Validate request body (Zod schema)
2. Validate category enum
3. Validate sizes array (must contain valid sizes)
4. Check duplicate product name
5. Insert product to database
6. Return created product

**Validation Schema:**
```typescript
// validators/product.validator.ts
import { z } from 'zod';

const VALID_CATEGORIES = ['Celana', 'Celana Jeans', 'Baju', 'Jaket'] as const;
const VALID_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  category: z.enum(VALID_CATEGORIES),
  sizes: z.array(z.enum(VALID_SIZES)).min(1),
  color: z.string().min(1).max(50),
  material: z.string().min(1).max(100),
  stock: z.number().int().min(0),
  price: z.number().positive(),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional(),
});
```

#### PUT/PATCH /api/products/:id
**Controller Logic:**
1. Validate product ID (UUID)
2. Check if product exists
3. Validate update data
4. Update product in database
5. Update `updatedAt` timestamp
6. Return updated product

#### DELETE /api/products/:id
**Controller Logic:**
1. Validate product ID
2. Check if product exists
3. Soft delete: Set `deletedAt` timestamp
4. Return success message

**Soft Delete Implementation:**
```typescript
// products.service.ts
async deleteProduct(id: string) {
  const result = await db
    .update(products)
    .set({ deletedAt: new Date() })
    .where(eq(products.id, id))
    .returning();
  
  if (!result.length) {
    throw new NotFoundError('Product not found');
  }
  
  return { success: true };
}
```

---

### 5.3 Dashboard Endpoints

#### GET /api/dashboard/stats
**Controller Logic:**
1. Query total products count
2. Query total stock sum
3. Query low stock products count (stock < 10)
4. Query category statistics (GROUP BY category)
5. Return aggregated data

**SQL Query Example:**
```typescript
// dashboard.service.ts
async getDashboardStats() {
  // Total products
  const [{ totalProducts }] = await db
    .select({ totalProducts: sql`count(*)` })
    .from(products)
    .where(isNull(products.deletedAt));
  
  // Total stock
  const [{ totalStock }] = await db
    .select({ totalStock: sql`sum(stock)` })
    .from(products)
    .where(isNull(products.deletedAt));
  
  // Low stock count
  const [{ lowStockProducts }] = await db
    .select({ lowStockProducts: sql`count(*)` })
    .from(products)
    .where(and(isNull(products.deletedAt), lt(products.stock, 10)));
  
  // Category stats
  const categoryStats = await db
    .select({
      category: products.category,
      totalProducts: sql`count(*)`,
      totalStock: sql`sum(stock)`,
    })
    .from(products)
    .where(isNull(products.deletedAt))
    .groupBy(products.category);
  
  return {
    totalProducts,
    totalStock,
    lowStockProducts,
    categoryStats,
  };
}
```

#### GET /api/dashboard/low-stock
**Controller Logic:**
1. Parse threshold parameter (default: 10)
2. Query products where stock < threshold
3. Order by stock ASC
4. Limit results
5. Return low stock products

---

### 5.4 Category Endpoints

#### GET /api/categories
**Controller Logic:**
1. Query distinct categories with product count
2. Return category list

```typescript
// categories.service.ts
async getCategories() {
  const categories = await db
    .select({
      id: sql`ROW_NUMBER() OVER (ORDER BY category)`,
      name: products.category,
      productCount: sql`count(*)`,
    })
    .from(products)
    .where(isNull(products.deletedAt))
    .groupBy(products.category);
  
  return categories;
}
```

#### GET /api/sizes
**Controller Logic:**
1. Return static array of valid sizes
2. Or query distinct sizes from database

---

## 6. Security Requirements

### 6.1 Authentication & Authorization

**JWT Implementation:**
```typescript
// middleware/auth.ts
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    // Attach user to request
    req.user = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);
    
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
};
```

**Password Hashing:**
```typescript
// auth.service.ts
const SALT_ROUNDS = 12;

async hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 6.2 Input Validation & Sanitization

**Zod Validation Middleware:**
```typescript
// middleware/validator.ts
export const validate = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.flatten().fieldErrors,
        });
      }
      next(error);
    }
  };
};
```

### 6.3 Rate Limiting

```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});
```

### 6.4 Security Headers (Helmet)

```typescript
// app.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

### 6.5 CORS Configuration

```typescript
// app.ts
import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
```

---

## 7. Error Handling

### 7.1 Custom Error Classes

```typescript
// utils/errors.ts
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409);
  }
}
```

### 7.2 Global Error Handler

```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Log unexpected errors
  logger.error('Unexpected error:', err);

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};
```

### 7.3 Response Formatter

```typescript
// utils/response.ts
export const successResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (message: string, errors?: any) => {
  return {
    success: false,
    message,
    ...(errors && { errors }),
  };
};
```

---

## 8. Performance Requirements

### 8.1 Database Optimization

**Connection Pooling:**
```typescript
// config/database.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool);
```

**Query Optimization:**
- Use indexes on frequently queried columns
- Avoid N+1 queries
- Use `EXPLAIN ANALYZE` for slow queries
- Implement query result caching (Redis) for dashboard stats

### 8.2 Caching Strategy (Optional but Recommended)

```typescript
// Redis caching for dashboard stats
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const getCachedStats = async () => {
  const cached = await redis.get('dashboard:stats');
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const stats = await dashboardService.getDashboardStats();
  
  // Cache for 5 minutes
  await redis.setex('dashboard:stats', 300, JSON.stringify(stats));
  
  return stats;
};
```

### 8.3 Response Time Targets

| Endpoint Type | Target Response Time |
|---------------|---------------------|
| GET (simple) | < 100ms |
| GET (with filters) | < 200ms |
| POST/PUT | < 300ms |
| DELETE | < 200ms |
| Dashboard stats | < 500ms (with caching < 50ms) |

---

## 9. Testing Requirements

### 9.1 Unit Tests

**Test Coverage:**
- Services: 90%+
- Controllers: 80%+
- Middleware: 90%+
- Utilities: 95%+

**Example Test:**
```typescript
// tests/unit/auth.service.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { authService } from '@/services/auth.service';

describe('AuthService', () => {
  describe('login', () => {
    it('should return user and token for valid credentials', async () => {
      const result = await authService.login('test@example.com', 'password123');
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw error for invalid credentials', async () => {
      await expect(
        authService.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
```

### 9.2 Integration Tests

**Test Scenarios:**
- Complete authentication flow
- Product CRUD operations
- Filtering and pagination
- Dashboard statistics accuracy
- Error handling

**Example Integration Test:**
```typescript
// tests/integration/products.test.ts
import request from 'supertest';
import { app } from '@/app';

describe('Products API', () => {
  let authToken: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'password' });
    
    authToken = response.body.data.token;
  });

  describe('GET /api/products', () => {
    it('should return paginated products', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('products');
      expect(response.body.data).toHaveProperty('pagination');
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/products?category=Celana%20Jeans')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      response.body.data.products.forEach((product: any) => {
        expect(product.category).toBe('Celana Jeans');
      });
    });
  });
});
```

### 9.3 Load Testing

**Tools:** Artillery, k6, or Apache JMeter

**Scenarios:**
- 100 concurrent users
- 1000 requests/minute
- Sustained load for 10 minutes

**Acceptance Criteria:**
- 95th percentile response time < 500ms
- Error rate < 0.1%
- No memory leaks

---

## 10. Environment Configuration

### 10.1 Environment Variables

```bash
# .env.example

# Server
NODE_ENV=development
PORT=3000
API_PREFIX=/api

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gudang_tekstil

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h

# CORS
FRONTEND_URL=http://localhost:3000

# Redis (Optional)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 10.2 Environment Validation

```typescript
// config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform(Number),
  DB_HOST: z.string(),
  DB_PORT: z.string().transform(Number),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string(),
  FRONTEND_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## 11. Deployment Guide

### 11.1 Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up database backups
- [ ] Configure logging (Winston + external service)
- [ ] Set up monitoring (PM2, New Relic, or Datadog)
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up CI/CD pipeline
- [ ] Run database migrations
- [ ] Seed initial data (admin user)

### 11.2 Database Migration

```bash
# Generate migration
npm run db:generate

# Run migrations
npm run db:migrate

# Rollback migration
npm run db:rollback
```

**Migration Script Example:**
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
  },
} satisfies Config;
```

### 11.3 Seed Data

```typescript
// src/db/seed.ts
import { db } from './index';
import { users, products } from './schema';
import bcrypt from 'bcrypt';

async function seed() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  await db.insert(users).values({
    email: 'admin@gudang.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'admin',
  });

  // Create sample products
  await db.insert(products).values([
    {
      name: 'Celana Jeans Slim Fit',
      category: 'Celana Jeans',
      sizes: ['S', 'M', 'L', 'XL'],
      color: 'Dark Blue',
      material: 'Denim',
      stock: 50,
      price: 250000,
      description: 'Celana jeans slim fit premium',
    },
    // ... more sample data
  ]);

  console.log('Seed completed!');
}

seed();
```

### 11.4 Docker Configuration (Optional)

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: gudang_tekstil
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

## 12. Logging & Monitoring

### 12.1 Winston Logger Setup

```typescript
// config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}
```

### 12.2 Request Logging

```typescript
// app.ts
import morgan from 'morgan';

app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
```

### 12.3 Monitoring Metrics

**Key Metrics to Track:**
- Request rate (requests/second)
- Response time (p50, p95, p99)
- Error rate
- Database query time
- Memory usage
- CPU usage
- Active connections

---

## 13. API Documentation

### 13.1 Swagger/OpenAPI

```typescript
// app.ts
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
```

### 13.2 Postman Collection

Create and maintain Postman collection with:
- All endpoints
- Example requests
- Environment variables
- Test scripts

---

## 14. Development Workflow

### 14.1 Git Workflow

**Branch Strategy:**
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches
- `hotfix/*`: Production hotfixes

**Commit Convention:**
```
feat: Add product filtering by size
fix: Fix pagination calculation
docs: Update API documentation
test: Add unit tests for auth service
refactor: Optimize product query
```

### 14.2 Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Proper error handling
- [ ] Input validation implemented
- [ ] Tests written and passing
- [ ] No console.logs (use logger)
- [ ] No hardcoded values
- [ ] Database queries optimized
- [ ] API contract followed
- [ ] Documentation updated

---

## 15. Success Metrics

### 15.1 Performance Metrics
- API response time < 200ms (GET)
- API response time < 500ms (POST/PUT)
- Database query time < 100ms
- 99.9% uptime

### 15.2 Quality Metrics
- Test coverage > 80%
- Zero critical security vulnerabilities
- Code review approval required
- All API endpoints documented

### 15.3 Business Metrics
- Support 1000+ concurrent users
- Handle 10,000+ products
- Process 100+ requests/second
- Data accuracy 100%

---

## 16. Future Enhancements (Phase 2)

### 16.1 Planned Features
- [ ] Role-based access control (RBAC)
- [ ] Activity logs and audit trail
- [ ] Export data to CSV/Excel
- [ ] Batch import products
- [ ] Email notifications for low stock
- [ ] Advanced analytics and reporting
- [ ] Multi-warehouse support
- [ ] Supplier management
- [ ] Barcode/QR code integration
- [ ] Real-time notifications (WebSocket)

### 16.2 Technical Improvements
- [ ] GraphQL API (alternative to REST)
- [ ] Redis caching layer
- [ ] Elasticsearch for advanced search
- [ ] Message queue (RabbitMQ/Bull) for async tasks
- [ ] Microservices architecture
- [ ] API versioning
- [ ] Rate limiting per user
- [ ] API key authentication for integrations

---

## 17. Support & Communication

### 17.1 Team Contacts

| Role | Name | Contact |
|------|------|---------|
| Project Manager | [PM Name] | pm@company.com |
| Backend Lead | [Backend Lead] | backend@company.com |
| Frontend Lead | [Frontend Lead] | frontend@company.com |
| DevOps | [DevOps Name] | devops@company.com |

### 17.2 Communication Channels

- **Slack:** #project-gudang-tekstil
- **Daily Standup:** 9:00 AM (Mon-Fri)
- **Sprint Planning:** Every 2 weeks
- **Code Review:** GitHub Pull Requests
- **Documentation:** Confluence/Notion

### 17.3 Issue Tracking

- **Bug Reports:** GitHub Issues with label `bug`
- **Feature Requests:** GitHub Issues with label `enhancement`
- **API Questions:** Slack channel or GitHub Discussions

---

## 18. Appendix

### 18.1 Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:generate      # Generate migration
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Drizzle Studio

# Testing
npm test                 # Run all tests
npm run test:unit        # Run unit tests
npm run test:integration # Run integration tests
npm run test:coverage    # Generate coverage report

# Linting & Formatting
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run type-check       # TypeScript type checking
```

### 18.2 Troubleshooting

**Common Issues:**

1. **Database connection failed**
   - Check PostgreSQL is running
   - Verify credentials in `.env`
   - Check firewall settings

2. **JWT token invalid**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Ensure Bearer token format

3. **Slow queries**
   - Check database indexes
   - Use EXPLAIN ANALYZE
   - Consider query optimization

### 18.3 References

- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)
- [API Security Checklist](https://github.com/shieldfy/API-Security-Checklist)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-24 | Initial Backend PRD with Express.js, Drizzle ORM, PostgreSQL specifications | Backend Team |

---

**Document Status:** ✅ Ready for Review

**Next Steps:**
1. Review and approve PRD
2. Set up development environment
3. Initialize project structure
4. Set up database and migrations
5. Implement authentication endpoints
6. Implement product CRUD endpoints
7. Implement dashboard endpoints
8. Write tests
9. Deploy to staging
10. Frontend integration testing
