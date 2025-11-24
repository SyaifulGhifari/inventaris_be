# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

Most endpoints require authentication using a Bearer Token.
Header: `Authorization: Bearer <token>`

> [!CAUTION]
> **JWT Secret**: `bb820b518b3ea4673dba5a58b793688710`
> This secret is for development purposes only. Do not share in production.

### Endpoints

#### Login
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "uuid",
        "email": "user@example.com",
        "name": "User Name",
        "role": "admin"
      },
      "token": "jwt_token_here"
    }
  }
  ```

#### Logout
- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Logged out successfully"
  }
  ```

#### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "admin"
    }
  }
  ```

---

## Products

### Get All Products
- **URL**: `/products`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10, max: 100)
  - `search`: string (search by name)
  - `category`: string (one of: 'Celana', 'Celana Jeans', 'Baju', 'Jaket')
  - `size`: string (one of: 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL')
  - `color`: string
  - `material`: string
  - `sortBy`: string ('name', 'stock', 'price', 'createdAt')
  - `order`: string ('asc', 'desc')
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "products": [
        {
          "id": "uuid",
          "name": "Product Name",
          "category": "Baju",
          "sizes": ["M", "L"],
          "color": "Red",
          "material": "Cotton",
          "stock": 100,
          "price": 50000,
          "description": "Description",
          "imageUrl": "http://example.com/image.jpg",
          "createdAt": "2023-01-01T00:00:00.000Z",
          "updatedAt": "2023-01-01T00:00:00.000Z"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 50,
        "totalPages": 5
      }
    }
  }
  ```

### Get Product by ID
- **URL**: `/products/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": { ...product_object }
  }
  ```

### Create Product
- **URL**: `/products`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "name": "New Product",
    "category": "Baju",
    "sizes": ["M", "L"],
    "color": "Blue",
    "material": "Cotton",
    "stock": 50,
    "price": 75000,
    "description": "Optional description",
    "imageUrl": "http://example.com/image.jpg"
  }
  ```
- **Constraints**:
  - `category`: Must be one of: 'Celana', 'Celana Jeans', 'Baju', 'Jaket'
  - `sizes`: Array of: 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'

### Update Product (Full)
- **URL**: `/products/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Same as Create Product (all fields optional for PATCH)

### Update Product (Partial)
- **URL**: `/products/:id`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Partial fields from Create Product

### Delete Product
- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully"
  }
  ```

---

## Dashboard

### Get Stats
- **URL**: `/dashboard/stats`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "totalProducts": 100,
      "totalStock": 5000,
      "lowStockCount": 5,
      "categoryDistribution": {
        "Baju": 40,
        "Celana": 60
      }
    }
  }
  ```

### Get Low Stock Products
- **URL**: `/dashboard/low-stock`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [ ...list_of_products ]
  }
  ```

---

## Categories & Sizes

### Get Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": [
      { "name": "Baju", "count": 40 },
      { "name": "Celana", "count": 60 }
    ]
  }
  ```

### Get Sizes
- **URL**: `/sizes`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "data": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]
  }
  ```
