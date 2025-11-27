import { productService } from "./product.service.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const formatProduct = (p) => ({
  id: p._id,
  sku: p.sku,
  name: p.name,
  description: p.description,
  category: p.category,
  type: p.type,
  price: p.price,
  discountPrice: p.discountPrice,
  quantity: p.quantity,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt
});

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: formatProduct(product)
  });
});

// Get All Products
export const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAll(
    req.validatedQuery,
    req.userRole
  );

  res.status(200).json({
    success: true,
    message: "Products retrieved successfully",
    data: products.map(formatProduct),
    pagination
  });
});

// Get Single Product
export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getById(req.params.id, req.userRole);

  if (!product)
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });

  res.status(200).json({
    success: true,
    data: formatProduct(product)
  });
});

// Update Product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(req.params.id, req.body);

  if (!product)
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: formatProduct(product)
  });
});

// Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await productService.delete(req.params.id);

  if (!product)
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    data: { id: product._id }
  });
});

// Stats
export const getStatistics = asyncHandler(async (req, res) => {
  const stats = await productService.stats();

  res.status(200).json({
    success: true,
    data: stats
  });
});
