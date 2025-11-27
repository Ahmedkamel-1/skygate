import { Product } from '../../../DB/models/product.model.js'

let statsCache = null;
let statsCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000;

const invalidateStatsCache = () => {
  statsCache = null;
  statsCacheTime = null;
};

export const productService = {
  // Create a new product
  async createProduct(productData) {
    try {
      // Sanitize data
      const sanitizedData = {
        sku: productData.sku.trim(),
        name: productData.name.trim(),
        description: productData.description ? productData.description.trim() : null,
        category: productData.category.trim(),
        type: productData.type,
        price: productData.price,
        discountPrice: productData.discountPrice || null,
        quantity: productData.quantity
      };

      const product = await Product.create(sanitizedData);
      invalidateStatsCache();

      console.log(`Product created: ${product.sku} - ${product.name}`);
      return product;
    } catch (error) {
      throw error;
    }
  },

  // Get all products with filters and pagination
  async getAllProducts(filters, userRole) {
    try {
      const { page, limit, category, type, search, sort, order, minPrice, maxPrice } = filters;

      const query = {};

      if (userRole === 'user') {
        query.type = 'public';
      }

      if (category) query.category = category;
      if (type) query.type = type;

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = minPrice;
        if (maxPrice !== undefined) query.price.$lte = maxPrice;
      }

      const totalItems = await Product.countDocuments(query);

      const sortObj = {};
      if (sort) {
        sortObj[sort] = order === 'desc' ? -1 : 1;
      }

      const products = await Product.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit);

      const totalPages = Math.ceil(totalItems / limit);

      console.log(`Retrieved ${products.length} products (page ${page}/${totalPages})`);

      return {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1
        }
      };
    } catch (error) {
      throw error;
    }
  },

  async getProductById(id, userRole) {
    try {
      const product = await Product.findById(id);

      if (!product) {
        return null;
      }

      if (userRole === 'user' && product.type === 'private') {
        return null;
      }

      console.log(`Product retrieved: ${product.sku}`);
      return product;
    } catch (error) {
      throw error;
    }
  },

  async updateProduct(id, updateData, userRole) {
    try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return null;
      }

      if (updateData.discountPrice !== undefined && updateData.discountPrice !== null) {
        const comparePrice = updateData.price !== undefined ? updateData.price : existingProduct.price;
        if (updateData.discountPrice >= comparePrice) {
          throw {
            isValidation: true,
            field: 'discountPrice',
            message: 'Discount price must be less than the original price'
          };
        }
      }

      const sanitizedData = {};
      if (updateData.name !== undefined) sanitizedData.name = updateData.name.trim();
      if (updateData.description !== undefined) {
        sanitizedData.description = updateData.description ? updateData.description.trim() : null;
      }
      if (updateData.category !== undefined) sanitizedData.category = updateData.category.trim();
      if (updateData.type !== undefined) sanitizedData.type = updateData.type;
      if (updateData.price !== undefined) sanitizedData.price = updateData.price;
      if (updateData.discountPrice !== undefined) sanitizedData.discountPrice = updateData.discountPrice;
      if (updateData.quantity !== undefined) sanitizedData.quantity = updateData.quantity;

      const product = await Product.findByIdAndUpdate(
        id,
        sanitizedData,
        { new: true, runValidators: true }
      );

      invalidateStatsCache();
      console.log(`Product updated: ${product.sku} - ${product.name}`);

      return product;
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return null;
      }

      invalidateStatsCache();
      console.log(`Product deleted: ${product.sku}`);

      return product;
    } catch (error) {
      throw error;
    }
  },

  async getStatistics() {
    try {
      if (statsCache && statsCacheTime && (Date.now() - statsCacheTime < CACHE_DURATION)) {
        console.log('Statistics retrieved from cache');
        return statsCache;
      }

      const products = await Product.find({});

      const totalProducts = products.length;
      let totalInventoryValue = 0;
      let totalDiscountedValue = 0;
      let outOfStockCount = 0;
      const categoryMap = {};
      const typeMap = {};

      products.forEach(product => {
        const inventoryValue = product.price * product.quantity;
        totalInventoryValue += inventoryValue;

        if (product.discountPrice !== null) {
          totalDiscountedValue += product.discountPrice * product.quantity;
        }

        if (product.quantity === 0) {
          outOfStockCount++;
        }

        if (!categoryMap[product.category]) {
          categoryMap[product.category] = { count: 0, totalValue: 0 };
        }
        categoryMap[product.category].count++;
        categoryMap[product.category].totalValue += inventoryValue;

        if (!typeMap[product.type]) {
          typeMap[product.type] = { count: 0, totalValue: 0 };
        }
        typeMap[product.type].count++;
        typeMap[product.type].totalValue += inventoryValue;
      });

      const averagePrice = totalProducts > 0 ? totalInventoryValue / totalProducts : 0;

      const productsByCategory = Object.entries(categoryMap).map(([category, data]) => ({
        category,
        count: data.count,
        totalValue: Math.round(data.totalValue * 100) / 100
      }));

      const productsByType = Object.entries(typeMap).map(([type, data]) => ({
        type,
        count: data.count,
        totalValue: Math.round(data.totalValue * 100) / 100
      }));

      const stats = {
        totalProducts,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
        totalDiscountedValue: Math.round(totalDiscountedValue * 100) / 100,
        averagePrice: Math.round(averagePrice * 100) / 100,
        outOfStockCount,
        productsByCategory,
        productsByType
      };

      statsCache = stats;
      statsCacheTime = Date.now();

      console.log('Statistics calculated and cached');
      return stats;
    } catch (error) {
      throw error;
    }
  }
};
