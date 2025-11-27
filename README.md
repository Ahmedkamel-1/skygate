# REST API Task

This project is a RESTful API built with **Node.js**, **Express**, **MongoDB**, and **Joi** for validation. It includes authentication using JWT, structured routes, controllers, services, middleware, and a clean folder structure.

## 🔐 Authentication

- User register
- User login
- Password hashing using **bcryptjs**
- Token generation using **jsonwebtoken**

## 🚀 Features

- Register
- login
- Get All Products
- Get Single product
- Delete Product
- Add product
  /

## 📦 Install Dependencies

```
npm install
```

## ▶️ Run the project

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## ⚙️ Environment Variables

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb+srv://ahmed:ahmed2411@cluster0.xzid19l.mongodb.net/?appName=Cluster0
JWT_SECRET=skygate__
SALT_ROUND = 8
```

## 📌 Validation

All requests are validated using **Joi** inside `/utils/validation.js`.

## 📍 Routes

Located in `/routes/auth.routes.js` and `/routes/user.routes.js`.

Example:

```
POST /api/auth/register
POST /api/auth/login
```

## 🧪 Testing

Use **Postman** or **Thunder Client** to test all endpoints.

## ✅ Status Codes

- `200` Success
- `201` Created
- `400` Bad Request
- `401` Unauthorized
- `404` Not Found
- `500` Server Error

## 📄 License

This project is for interview task purposes only.

## Setup Instructions

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
MONGO_URI=mongodb+srv://ahmed:ahmed2411@cluster0.xzid19l.mongodb.net/?appName=Cluster0
JWT_SECRET=skygate__
SALT_ROUND = 8
```

## How to Run the Project

```bash
npm run dev
```

Server starts at: `http://localhost:5000`

## API Endpoint Examples

### POST /api/auth/register

```json
{
  "name": "Ahmed",
  "email": "ahmed@example.com",
  "password": "12345678"
}
```

### POST /api/auth/login

```json
{
  "email": "ahmed@example.com",
  "password": "12345678"
}
```
