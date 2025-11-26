import  dotenv  from 'dotenv';
import express from 'express'
import { swaggerDocs } from "./src/config/swagger.js";
import { connectDB } from './DB/connection.js'
import {productRouter} from './src/modules/product/product.router.js'
import authRouter from './src/modules/auth/auth.router.js'
//import { authLimiter, generalLimiter } from '././src/middleware/ratelimiter.js'


const app = express();
dotenv.config()

// Middleware
app.use(express.json());
//app.use(generalLimiter)
//app.use('auth',authLimiter , authRouter)
// API Routes
const router = express.Router();


swaggerDocs(app);
// product  router
app.use('/api/products', productRouter);

// auth
app.use('/api/auth' , authRouter)

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Custom validation error from module
  if (err.isValidation) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details: [{
          field: err.field,
          message: err.message
        }]
      }
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: {
        code: 'VALIDATION_ERROR',
        details
      }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `Product with this ${field.toUpperCase()} already exists`,
      error: {
        code: 'DUPLICATE_SKU',
        details: {
          field,
          value: err.keyValue[field]
        }
      }
    });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Product not found',
      error: {
        code: 'NOT_FOUND',
        details: {
          resource: 'Product',
          id: err.value
        }
      }
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred',
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      details: 'Please try again later'
    }
  });
});

// connect Database
connectDB()

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))