# Gudang Tekstil - Backend API

Backend API untuk sistem manajemen inventaris gudang tekstil menggunakan Express.js, Drizzle ORM, dan PostgreSQL.

## 🚀 Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Database:** PostgreSQL v14+
- **ORM:** Drizzle ORM
- **Authentication:** JWT (JSON Web Token)
- **Validation:** Zod
- **Security:** bcrypt, helmet, cors, rate-limiting
- **Language:** TypeScript

## 📋 Prerequisites

- Node.js v18 atau lebih tinggi
- PostgreSQL v14 atau lebih tinggi
- npm atau yarn

## 🛠️ Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd "cobalah BE"
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi Anda:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=gudang_tekstil

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_characters

# CORS
FRONTEND_URL=http://localhost:3000
```

4. **Create database**
```bash
# Login ke PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gudang_tekstil;
```

5. **Run database migrations**
```bash
npm run db:migrate
```

6. **Seed database with initial data**
```bash
npm run db:seed
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Production Mode
```bash
# Build
npm run build

# Start
npm start
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000/api
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gudang.com",
  "password": "admin123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=10&search=jeans&category=Celana%20Jeans
Authorization: Bearer {token}
```

Query Parameters:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search by product name
- `category` (string): Filter by category (Celana, Celana Jeans, Baju, Jaket)
- `size` (string): Filter by size (XS, S, M, L, XL, XXL, XXXL)
- `color` (string): Filter by color
- `material` (string): Filter by material
- `sortBy` (string): Sort field (name, stock, price, createdAt)
- `order` (string): Sort order (asc, desc)

#### Get Product by ID
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

#### Create Product
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Celana Jeans Slim Fit",
  "category": "Celana Jeans",
  "sizes": ["S", "M", "L", "XL"],
  "color": "Dark Blue",
  "material": "Denim",
  "stock": 50,
  "price": 250000,
  "description": "Celana jeans slim fit premium",
  "imageUrl": "https://example.com/image.jpg"
}
```

#### Update Product
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "stock": 75
}
```

#### Delete Product
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

### Dashboard Endpoints

#### Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

#### Get Low Stock Products
```http
GET /api/dashboard/low-stock?threshold=10&limit=20
Authorization: Bearer {token}
```

### Category Endpoints

#### Get All Categories
```http
GET /api/categories
Authorization: Bearer {token}
```

#### Get Available Sizes
```http
GET /api/sizes
Authorization: Bearer {token}
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID): Primary key
- `email` (VARCHAR): Unique email
- `password` (VARCHAR): Hashed password
- `name` (VARCHAR): User name
- `role` (VARCHAR): User role (admin, staff, manager)
- `createdAt` (TIMESTAMP): Creation timestamp
- `updatedAt` (TIMESTAMP): Update timestamp

### Products Table
- `id` (UUID): Primary key
- `name` (VARCHAR): Product name
- `category` (VARCHAR): Category (Celana, Celana Jeans, Baju, Jaket)
- `sizes` (JSONB): Array of sizes
- `color` (VARCHAR): Product color
- `material` (VARCHAR): Material type
- `stock` (INTEGER): Stock quantity
- `price` (NUMERIC): Product price
- `description` (TEXT): Product description
- `imageUrl` (VARCHAR): Image URL
- `createdBy` (UUID): Creator user ID
- `updatedBy` (UUID): Last updater user ID
- `createdAt` (TIMESTAMP): Creation timestamp
- `updatedAt` (TIMESTAMP): Update timestamp
- `deletedAt` (TIMESTAMP): Soft delete timestamp

## 🔐 Default Credentials

Setelah menjalankan seed script:

**Admin User:**
- Email: `admin@gudang.com`
- Password: `admin123`

**Staff User:**
- Email: `staff@gudang.com`
- Password: `staff123`

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## 📝 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run db:generate      # Generate migration
npm run db:migrate       # Run migrations
npm run db:studio        # Open Drizzle Studio
npm run db:seed          # Seed database
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run type-check       # TypeScript type checking
```

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── database.ts   # Database connection
│   ├── env.ts        # Environment validation
│   └── logger.ts     # Logger setup
├── db/
│   └── schema/       # Database schemas
├── middleware/       # Express middleware
├── routes/           # API routes
├── controllers/      # Request handlers
├── services/         # Business logic
├── utils/            # Utility functions
├── types/            # TypeScript types
├── validators/       # Zod schemas
├── app.ts            # Express app setup
└── server.ts         # Server entry point
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- Helmet security headers
- CORS protection
- Input validation with Zod
- SQL injection prevention (Drizzle ORM)

## 📊 Performance

- Database connection pooling
- Indexed queries for fast lookups
- Pagination for large datasets
- Response time targets:
  - GET requests: < 200ms
  - POST/PUT requests: < 500ms

## 🐛 Troubleshooting

### Database connection failed
- Pastikan PostgreSQL sudah berjalan
- Cek credentials di file `.env`
- Pastikan database sudah dibuat

### JWT token invalid
- Pastikan `JWT_SECRET` sudah diset di `.env`
- Cek format token: `Bearer {token}`
- Token expired setelah 24 jam

## 📄 License

MIT

## 👥 Team

Backend Team - Gudang Tekstil Project
