import {productService} from './product.service.js'
import {asyncHandler} from '../../utils/asyncHandler.js'

// Format product response
export const formatProductResponse = (product) => ({
  id: product._id,
  sku: product.sku,
  name: product.name,
  description: product.description,
  category: product.category,
  type: product.type,
  price: product.price,
  discountPrice: product.discountPrice,
  quantity: product.quantity,
  createdAt: product.createdAt.toISOString(),
  updatedAt: product.updatedAt.toISOString()
});


// Create Product
export const createProduct = asyncHandler(async (req, res) => {
    const product = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: formatProductResponse(product)
    });
  })


// Get All Products
export const getAllProducts = asyncHandler(async (req, res) => {
  const { products, pagination } = await productService.getAllProducts(
    req.validatedQuery, 
    req.userRole
  );

  res.status(200).json({
    success: true,
    message: 'Products retrieved successfully',
    data: products.map(formatProductResponse),
    pagination
  });
});


// Get Single Product
export const getProductById = asyncHandler(async (req, res) => {
    const product = await productService.getProductById(req.params.id, req.userRole);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            resource: 'Product',
            id: req.params.id
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: formatProductResponse(product)
    });
})


// Update Product
export const updateProduct = asyncHandler(async (req, res) => {
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      req.userRole
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            resource: 'Product',
            id: req.params.id
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: formatProductResponse(product)
    });
  })

 
// Delete Product
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        error: {
          code: 'NOT_FOUND',
          details: {
            resource: 'Product',
            id: req.params.id
          }
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {
        id: product._id,
        sku: product.sku
      }
    });
  })


// Get Statistics
export const getStatistics = asyncHandler(async (req, res) => {
    const stats = await productService.getStatistics();

    res.status(200).json({
      success: true,
      message: 'Statistics retrieved successfully',
      data: stats
    });
})



