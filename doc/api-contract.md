# API Contract - Website Gudang Tekstil

## Document Information

| Item | Detail |
|------|--------|
| **Project** | Website Gudang Tekstil - Textile Inventory Management System |
| **Version** | 2.0.0 |
| **Last Updated** | 2025-11-24 |
| **Backend Team** | To be assigned |
| **Frontend Team** | Next.js (TypeScript) + shadcn/ui |

---

## Base URL

```
Development: http://localhost:3000/api
Production: https://api.gudang.com/api
```

---

## Authentication

All endpoints (except `/auth/login`) require authentication using **Bearer Token** in the header:

```
Authorization: Bearer {access_token}
```

---

## 1. Authentication Endpoints

### 1.1 Login

**Endpoint:** `POST /auth/login`

**Description:** Authenticate user and return access token

**Request Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required, min 6 characters)"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "admin | staff | manager"
    },
    "token": "string (JWT token)",
    "expiresIn": "number (seconds)"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid input
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "email": ["Email is required", "Invalid email format"],
    "password": ["Password is required"]
  }
}
```

- **401 Unauthorized** - Invalid credentials
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 1.2 Logout

**Endpoint:** `POST /auth/logout`

**Description:** Invalidate current session/token

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Responses:**

- **401 Unauthorized** - Invalid or expired token
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 1.3 Get Current User

**Endpoint:** `GET /auth/me`

**Description:** Get current authenticated user information

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "admin | staff | manager"
  }
}
```

**Error Responses:**

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 2. Product Endpoints

### 2.1 Get All Products (with Pagination)

**Endpoint:** `GET /products`

**Description:** Retrieve paginated list of products

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Current page number |
| `limit` | number | No | 10 | Items per page (max 100) |
| `search` | string | No | - | Search by product name |
| `category` | string | No | - | Filter by category (Celana, Celana Jeans, Baju, Jaket) |
| `size` | string | No | - | Filter by size (XS, S, M, L, XL, XXL, XXXL) |
| `color` | string | No | - | Filter by color |
| `material` | string | No | - | Filter by material |
| `sortBy` | string | No | createdAt | Sort field (name, stock, price, createdAt) |
| `order` | string | No | desc | Sort order (asc, desc) |

**Example Request:**
```
GET /products?page=1&limit=10&search=jeans&category=Celana%20Jeans&size=M&color=blue&material=Denim&sortBy=name&order=asc
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "name": "string",
        "category": "Celana | Celana Jeans | Baju | Jaket",
        "sizes": ["string"],
        "color": "string",
        "material": "string",
        "stock": "number",
        "price": "number",
        "description": "string (optional)",
        "imageUrl": "string (optional)",
        "createdAt": "string (ISO 8601)",
        "updatedAt": "string (ISO 8601)"
      }
    ],
    "pagination": {
      "currentPage": "number",
      "totalPages": "number",
      "totalItems": "number",
      "itemsPerPage": "number",
      "hasNextPage": "boolean",
      "hasPreviousPage": "boolean"
    }
  }
}
```

**Error Responses:**

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

- **400 Bad Request** - Invalid query parameters
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "errors": {
    "page": ["Page must be a positive number"],
    "limit": ["Limit must not exceed 100"]
  }
}
```

---

### 2.2 Get Product by ID

**Endpoint:** `GET /products/{id}`

**Description:** Retrieve single product details

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "category": "Celana | Celana Jeans | Baju | Jaket",
    "sizes": ["string"],
    "color": "string",
    "material": "string",
    "stock": "number",
    "price": "number",
    "description": "string (optional)",
    "imageUrl": "string (optional)",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Error Responses:**

- **404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2.3 Create Product

**Endpoint:** `POST /products`

**Description:** Create a new product

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Request Body:**
```json
{
  "name": "string (required, max 255 characters)",
  "category": "string (required, enum: Celana, Celana Jeans, Baju, Jaket)",
  "sizes": ["string (required, array of sizes: XS, S, M, L, XL, XXL, XXXL)"],
  "color": "string (required, max 50 characters)",
  "material": "string (required, max 100 characters)",
  "stock": "number (required, min 0)",
  "price": "number (required, min 0)",
  "description": "string (optional, max 1000 characters)",
  "imageUrl": "string (optional, valid URL)"
}
```

**Example Request:**
```json
{
  "name": "Celana Jeans Slim Fit",
  "category": "Celana Jeans",
  "sizes": ["S", "M", "L", "XL"],
  "color": "Dark Blue",
  "material": "Denim",
  "stock": 50,
  "price": 250000,
  "description": "Celana jeans slim fit dengan bahan denim premium",
  "imageUrl": "https://example.com/images/jeans-001.jpg"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "string",
    "name": "string",
    "category": "Celana | Celana Jeans | Baju | Jaket",
    "sizes": ["string"],
    "color": "string",
    "material": "string",
    "stock": "number",
    "price": "number",
    "description": "string",
    "imageUrl": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Validation error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "name": ["Name is required", "Name must not exceed 255 characters"],
    "category": ["Category is required", "Category must be one of: Celana, Celana Jeans, Baju, Jaket"],
    "sizes": ["Sizes is required", "Sizes must be an array", "Invalid size value"],
    "color": ["Color is required"],
    "material": ["Material is required"],
    "stock": ["Stock must be a non-negative number"],
    "price": ["Price must be a positive number"]
  }
}
```

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

- **409 Conflict** - Duplicate product name
```json
{
  "success": false,
  "message": "Product with this name already exists"
}
```

---

### 2.4 Update Product

**Endpoint:** `PUT /products/{id}` or `PATCH /products/{id}`

**Description:** Update existing product (full or partial update)

**Request Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {access_token}"
}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID |

**Request Body:**
```json
{
  "name": "string (optional, max 255 characters)",
  "category": "string (optional, enum: Celana, Celana Jeans, Baju, Jaket)",
  "sizes": ["string (optional, array of sizes: XS, S, M, L, XL, XXL, XXXL)"],
  "color": "string (optional, max 50 characters)",
  "material": "string (optional, max 100 characters)",
  "stock": "number (optional, min 0)",
  "price": "number (optional, min 0)",
  "description": "string (optional, max 1000 characters)",
  "imageUrl": "string (optional, valid URL)"
}
```

**Example Request (Update Stock):**
```json
{
  "stock": 75
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "id": "string",
    "name": "string",
    "category": "Celana | Celana Jeans | Baju | Jaket",
    "sizes": ["string"],
    "color": "string",
    "material": "string",
    "stock": "number",
    "price": "number",
    "description": "string",
    "imageUrl": "string",
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  }
}
```

**Error Responses:**

- **404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

- **400 Bad Request** - Validation error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "stock": ["Stock must be a non-negative number"]
  }
}
```

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 2.5 Delete Product

**Endpoint:** `DELETE /products/{id}`

**Description:** Delete a product (soft delete recommended)

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Product ID |

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Responses:**

- **404 Not Found**
```json
{
  "success": false,
  "message": "Product not found"
}
```

- **401 Unauthorized**
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

## 3. Category Endpoints (Optional but Recommended)

### 3.1 Get All Categories

**Endpoint:** `GET /categories`

**Description:** Get list of all product categories

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "Celana | Celana Jeans | Baju | Jaket",
      "productCount": "number"
    }
  ]
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Celana",
      "productCount": 45
    },
    {
      "id": "2",
      "name": "Celana Jeans",
      "productCount": 32
    },
    {
      "id": "3",
      "name": "Baju",
      "productCount": 78
    },
    {
      "id": "4",
      "name": "Jaket",
      "productCount": 23
    }
  ]
}
```

---

### 3.2 Get Available Sizes

**Endpoint:** `GET /sizes`

**Description:** Get list of all available product sizes

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "XXL",
    "XXXL"
  ]
}
```

---

## 4. Dashboard & Statistics Endpoints

### 4.1 Get Dashboard Statistics

**Endpoint:** `GET /dashboard/stats`

**Description:** Get overall statistics for dashboard display

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalProducts": "number",
    "totalStock": "number",
    "lowStockProducts": "number",
    "categoryStats": [
      {
        "category": "Celana | Celana Jeans | Baju | Jaket",
        "totalProducts": "number",
        "totalStock": "number"
      }
    ]
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalProducts": 178,
    "totalStock": 2450,
    "lowStockProducts": 12,
    "categoryStats": [
      {
        "category": "Celana",
        "totalProducts": 45,
        "totalStock": 680
      },
      {
        "category": "Celana Jeans",
        "totalProducts": 32,
        "totalStock": 520
      },
      {
        "category": "Baju",
        "totalProducts": 78,
        "totalStock": 890
      },
      {
        "category": "Jaket",
        "totalProducts": 23,
        "totalStock": 360
      }
    ]
  }
}
```

---

### 4.2 Get Low Stock Products

**Endpoint:** `GET /dashboard/low-stock`

**Description:** Get products with stock below threshold

**Request Headers:**
```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `threshold` | number | No | 10 | Stock threshold value |
| `limit` | number | No | 20 | Maximum items to return |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "category": "Celana | Celana Jeans | Baju | Jaket",
      "stock": "number",
      "threshold": "number"
    }
  ]
}
```

---

## 5. Common Error Responses

### 5.1 Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details (only in development mode)"
}
```

### 5.2 Rate Limit (429)
```json
{
  "success": false,
  "message": "Too many requests, please try again later",
  "retryAfter": "number (seconds)"
}
```

---

## 6. Data Types & Validation Rules

### Product Object
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string | UUID/ObjectId | Unique identifier |
| `name` | string | Required, 1-255 chars | Product name |
| `category` | string | Required, enum: Celana, Celana Jeans, Baju, Jaket | Product category (textile type) |
| `sizes` | array | Required, array of strings | Available sizes (XS, S, M, L, XL, XXL, XXXL) |
| `color` | string | Required, 1-50 chars | Product color |
| `material` | string | Required, 1-100 chars | Fabric material (Katun, Denim, Polyester, Wool, etc) |
| `stock` | number | Required, >= 0, integer | Available quantity |
| `price` | number | Required, > 0 | Price in IDR (Rupiah) |
| `description` | string | Optional, max 1000 chars | Product description |
| `imageUrl` | string | Optional, valid URL | Product image URL |
| `createdAt` | string | ISO 8601 format | Creation timestamp |
| `updatedAt` | string | ISO 8601 format | Last update timestamp |

### User Object
| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | string | UUID/ObjectId | Unique identifier |
| `email` | string | Required, valid email | User email |
| `name` | string | Required | User full name |
| `role` | string | enum: admin, staff, manager | User role |

---

## 7. Important Notes for Backend Team

### 7.1 Security Requirements
- ✅ Implement JWT-based authentication
- ✅ Hash passwords using bcrypt (min 10 rounds)
- ✅ Validate all inputs on server-side
- ✅ Implement rate limiting (recommended: 100 requests/15 minutes per IP)
- ✅ Use HTTPS in production
- ✅ Sanitize all user inputs to prevent SQL injection/XSS
- ✅ Implement CORS properly

### 7.2 Performance Requirements
- ✅ Response time should be < 200ms for GET requests
- ✅ Response time should be < 500ms for POST/PUT requests
- ✅ Implement database indexing on frequently queried fields (id, name, category, sizes, color, material)
- ✅ Use pagination for all list endpoints

### 7.3 Database Recommendations
- Use indexes on: `products.id`, `products.name`, `products.category`, `products.color`, `products.material`, `users.email`
- Implement soft delete for products (add `deletedAt` field)
- Add `createdBy` and `updatedBy` fields for audit trail (optional)
- Consider using JSONB for `sizes` array in PostgreSQL for better querying

### 7.4 Textile-Specific Requirements
- ✅ Validate `category` field against enum: Celana, Celana Jeans, Baju, Jaket
- ✅ Validate `sizes` array contains only valid sizes: XS, S, M, L, XL, XXL, XXXL
- ✅ Ensure `sizes` array is not empty when creating/updating products
- ✅ Store `color` and `material` as searchable text fields
- ✅ Implement case-insensitive search for color and material
- ✅ Consider normalizing color and material values (e.g., "dark blue" vs "Dark Blue")

### 7.5 Response Format Consistency
- Always return JSON
- Use consistent field naming (camelCase)
- Always include `success` boolean field
- Include `message` field for user-friendly messages
- Use `data` field for response payload
- Use `errors` object for validation errors

### 7.6 HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT, DELETE |
| 201 | Successful POST (resource created) |
| 400 | Bad request / Validation error |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 429 | Too many requests |
| 500 | Internal server error |

---

## 8. Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Login with missing fields
- [ ] Logout successfully
- [ ] Access protected routes without token
- [ ] Access protected routes with expired token

### Products
- [ ] Get products with pagination
- [ ] Get products with search filter
- [ ] Get products with category filter (Celana, Celana Jeans, Baju, Jaket)
- [ ] Get products with size filter (XS, S, M, L, XL, XXL, XXXL)
- [ ] Get products with color filter
- [ ] Get products with material filter
- [ ] Get single product by valid ID
- [ ] Get single product by invalid ID
- [ ] Create product with valid data (all textile fields)
- [ ] Create product with invalid category
- [ ] Create product with invalid sizes array
- [ ] Create product with missing required fields
- [ ] Update product stock
- [ ] Update product color and material
- [ ] Update product with invalid data
- [ ] Delete existing product
- [ ] Delete non-existing product

### Dashboard & Statistics
- [ ] Get dashboard statistics
- [ ] Get low stock products with default threshold
- [ ] Get low stock products with custom threshold
- [ ] Verify category stats accuracy

### Categories
- [ ] Get all textile categories
- [ ] Verify product count per category

---

## 9. Future API Endpoints (Phase 2)

### Role Management
- `GET /users` - Get all users
- `POST /users` - Create new user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Export Data
- `GET /products/export?format=csv` - Export products to CSV
- `GET /products/export?format=excel` - Export products to Excel
- `GET /products/export?category=Celana&format=csv` - Export with filters

### Activity Logs
- `GET /logs` - Get activity logs
- `GET /logs/products/{id}` - Get product activity history
- `GET /logs/stock-changes` - Get stock change history

### Notifications
- `GET /notifications/low-stock` - Get low stock notifications
- `POST /notifications/settings` - Configure notification settings

### Supplier Management (Future)
- `GET /suppliers` - Get all suppliers
- `POST /suppliers` - Create new supplier
- `GET /products/{id}/supplier` - Get product supplier info

---

## 10. Contact & Support

For questions or clarifications regarding this API contract, please contact:

- **Frontend Lead:** [Your Name]
- **Project Manager:** [PM Name]
- **Slack Channel:** #project-gudang-tekstil
- **Documentation:** [Link to additional docs]

---

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0.0 | 2025-11-24 | Initial API contract | Frontend Team |
| 2.0.0 | 2025-11-24 | Updated for textile warehouse with new fields (sizes, color, material, imageUrl) and dashboard endpoints | Frontend Team |
