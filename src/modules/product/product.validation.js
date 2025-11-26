import Joi from "joi"

export const priceWithTwoDecimals = Joi.number().positive().precision(2);

export const createProductSchema = Joi.object({
  sku: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9-_]+$/)
    .required()
    .messages({
      "string.empty": "SKU is required",
      "string.min": "SKU must be at least 3 characters",
      "string.max": "SKU must not exceed 50 characters",
      "string.pattern.base": "SKU must be alphanumeric and may include hyphens/underscores",
    }),

  name: Joi.string().trim().min(3).max(200).required(),

  description: Joi.string().max(1000).allow(null, ""),

  category: Joi.string().trim().min(2).max(100).required(),

  type: Joi.string()
    .valid("public", "private")
    .required(),

  price: priceWithTwoDecimals.required(),

  discountPrice: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional(),

  quantity: Joi.number().integer().min(0).required(),
}).custom((body, helpers) => {
  if (body.discountPrice !== undefined && body.discountPrice !== null) {
    if (body.discountPrice >= body.price) {
      return helpers.error("any.invalid", {
        message: "Discount price must be less than the original price",
      });
    }
  }

  return body;
});



export const updateProductSchema = Joi.object({
  sku: Joi.forbidden().messages({
    "any.unknown": "SKU cannot be updated",
  }),

  name: Joi.string().trim().min(3).max(200),

  description: Joi.string().max(1000).allow(null, ""),

  category: Joi.string().trim().min(2).max(100),

  type: Joi.string().valid("public", "private"),

  price: priceWithTwoDecimals,

  discountPrice: Joi.number().min(0).precision(2).allow(null),

  quantity: Joi.number().integer().min(0),
})
  .custom((body, helpers) => {
    // If price and discountPrice BOTH exist
    if (
      body.price !== undefined &&
      body.discountPrice !== undefined &&
      body.discountPrice !== null
    ) {
      if (body.discountPrice >= body.price) {
        return helpers.error("any.invalid", {
          message: "Discount price must be less than the original price",
        });
      }
    }

    return body;
  })
  .min(1);

