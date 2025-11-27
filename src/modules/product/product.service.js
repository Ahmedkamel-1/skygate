import { Product } from "../../../DB/models/product.model.js";

export const productService = {
  async create(data) {
    const sanitized = {
      sku: data.sku.trim(),
      name: data.name.trim(),
      description: data.description?.trim() || null,
      category: data.category.trim(),
      type: data.type,
      price: data.price,
      discountPrice: data.discountPrice ?? null,
      quantity: data.quantity
    };

    return await Product.create(sanitized);
  },

  async getAll(filters, role) {
    const { page, limit, category, type, search, sort, order, minPrice, maxPrice } =
      filters;

    const query = {};

    if (role === "user") query.type = "public";
    if (category) query.category = category;
    if (type) query.type = type;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = minPrice;
      if (maxPrice) query.price.$lte = maxPrice;
    }

    const totalItems = await Product.countDocuments(query);

    const products = await Product.find(query)
      .sort({ [sort]: order === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      products,
      pagination: {
        currentPage: page,
        totalItems,
        totalPages: Math.ceil(totalItems / limit)
      }
    };
  },

  async getById(id, role) {
    const product = await Product.findById(id);
    if (!product) return null;

    if (role === "user" && product.type === "private") return null;

    return product;
  },

  async update(id, data) {
    const sanitized = {};

    if (data.name) sanitized.name = data.name.trim();
    if (data.description !== undefined)
      sanitized.description = data.description?.trim() || null;

    if (data.category) sanitized.category = data.category.trim();
    if (data.type) sanitized.type = data.type;
    if (data.price !== undefined) sanitized.price = data.price;
    if (data.discountPrice !== undefined) sanitized.discountPrice = data.discountPrice;
    if (data.quantity !== undefined) sanitized.quantity = data.quantity;

    const product = await Product.findByIdAndUpdate(id, sanitized, {
      new: true,
      runValidators: true
    });

    return product;
  },

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  },

  async stats() {
    const products = await Product.find({});

    return {
      totalProducts: products.length,
      outOfStock: products.filter((p) => p.quantity === 0).length,
      averagePrice:
        products.reduce((a, p) => a + p.price, 0) / (products.length || 1)
    };
  }
};
