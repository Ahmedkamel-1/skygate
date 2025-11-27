# REST API Task

This project is a RESTful API built with **Node.js**, **Express**, **MongoDB**, and **Joi** for validation. It includes authentication using JWT, structured routes, controllers, services, middleware, and a clean folder structure.

## 🔐 Authentication

- User register
- User login
- Password hashing using **bcryptjs**
- Token generation using **jsonwebtoken**

## 🚀 Features

- login
- register
- CRUD operations for Products
- Product statistics
- Swagger documentation for endpoints

## 📌 Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/Ahmedkamel-1/skygate.git
cd skygate
```

2. Install dependencies:

```bash
npm install
```

3. Create an `.env` file in the root directory.

## Environment Variables

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## How to Run the Project

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

## API Endpoint Examples

### Auth Routes

**POST /api/auth/register**
Registers a new user.
Body:

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "12345678"
}
```

**POST /api/auth/login**
Logs in a user.
Body:

```json
{
  "email": "ahmed@example.com",
  "password": "12345678"
}
```

Response:

```json
{
  "message": "Login successful",
  "token": "jwt_token_here"
}
```

### Product Routes

**GET /api/products**
Get all products with optional query filters:

- `page` - page number
- `limit` - items per page
- `category` - filter by category
- `search` - search term
- `type` - product type

**POST /api/products** (Admin only)
Body:

```json
{
  "name": "iPhone 15",
  "price": 20000,
  "sku": "IPH-15-BLK",
  "category": "mobiles"
}
```

**GET /api/products/:id**
Get single product by ID.

**PUT /api/products/:id** (Admin only)
Update a product by ID.

**DELETE /api/products/:id** (Admin only)
Delete a product by ID.

**GET /api/products/stats** (Admin only)
Get statistics for products.

All endpoints are secured with JWT token in the header where required:

```
Authorization: Bearer <token>
```
