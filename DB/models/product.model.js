import mongoose from 'mongoose'

// schema
const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 50
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  },
  description: {
    type: String,
    default: null,
    maxlength: 1000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  type: {
    type: String,
    required: true,
    enum: ['public', 'private'],
    default: 'public'
  },
  price: {
    type: Number,
    required: true,
    min: 0.01
  },
  discountPrice: {
    type: Number,
    default: null,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});


productSchema.index({ sku: 1 });
productSchema.index({ category: 1 });
productSchema.index({ type: 1 });
productSchema.index({ price: 1 });


// model
export const Product = mongoose.model('Product' , productSchema)

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateProduct:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - category
 *         - type
 *         - price
 *         - quantity
 *       properties:
 *         sku:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         type:
 *           type: string
 *           enum: [public, private]
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *         quantity:
 *           type: number
 *
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         type:
 *           type: string
 *           enum: [public, private]
 *         price:
 *           type: number
 *         discountPrice:
 *           type: number
 *         quantity:
 *           type: number
 */
