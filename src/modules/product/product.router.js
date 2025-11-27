import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getStatistics,
} from "../product/product.controller.js";
import { createProductSchema, queryParamsSchema, updateProductSchema, validate } from "../../middleware/validation.middleware.js";
import { auth } from "../../middleware/authorization.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get product statistics
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */
router.get('/stats', auth("admin"), getStatistics);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         sku:
 *           type: string
 *           example: amxdvcfsdxfefhevjj4h
 *         name:
 *           type: string
 *           example: iphon 18
 *         description:
 *           type: string
 *           example: fjkdsdfgl;ksfjgl;'fgshjjs;
 *         category:
 *           type: string
 *           example: Phone
 *         type:
 *           type: string
 *           enum: [public, private]
 *           example: public
 *         price:
 *           type: number
 *           example: 9000
 *         discountPrice:
 *           type: number
 *           example: 8000
 *         quantity:
 *           type: number
 *           example: 20
 *
 *     CreateProductDto:
 *       type: object
 *       required:
 *         - sku
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         sku:
 *           type: string
 *           example: amxdvcfsdxfefhevjj4h
 *         name:
 *           type: string
 *           example: iphon 18
 *         description:
 *           type: string
 *           example: fjkdsdfgl;ksfjgl;'fgshjjs;
 *         category:
 *           type: string
 *           example: Phone
 *         type:
 *           type: string
 *           enum: [public, private]
 *           example: public
 *         price:
 *           type: number
 *           example: 9000
 *         discountPrice:
 *           type: number
 *           example: 8000
 *         quantity:
 *           type: number
 *           example: 20
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/",auth("admin"),validate(createProductSchema, "body"),createProduct);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
router.get("/", auth(), validate(queryParamsSchema, "query"), getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 */
router.get("/:id", auth(), getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductDto'
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.put("/:id", auth("admin"), validate(updateProductSchema, "body"),updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.delete("/:id", auth("admin"), deleteProduct);

export default router;
