import Joi from 'joi';

export const createProductSchema = Joi.object({
  sku: Joi.string()
    .trim()
    .min(3)
    .max(50)
    .pattern(/^[A-Za-z0-9_-]+$/)
    .required()
    .messages({
      'string.empty': 'SKU is required and must be 3-50 characters',
      'string.min': 'SKU is required and must be 3-50 characters',
      'string.max': 'SKU is required and must be 3-50 characters',
      'string.pattern.base': 'SKU must be alphanumeric (A-Z, a-z, 0-9, hyphens, underscores)',
      'any.required': 'SKU is required and must be 3-50 characters'
    }),
  name: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Name must be at least 3 characters long',
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 200 characters',
      'any.required': 'Name must be at least 3 characters long'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  category: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Category is required',
      'string.min': 'Category is required',
      'string.max': 'Category must not exceed 100 characters',
      'any.required': 'Category is required'
    }),
  type: Joi.string()
    .valid('public', 'private')
    .required()
    .messages({
      'any.only': 'Type must be either "public" or "private"',
      'any.required': 'Type must be either "public" or "private"'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .custom((value, helpers) => {
      if (value <= 0) return helpers.error('number.positive');
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) return helpers.message('Price must have at most 2 decimal places');
      return value;
    })
    .messages({
      'number.base': 'Price must be greater than 0',
      'number.positive': 'Price must be greater than 0',
      'any.required': 'Price must be greater than 0'
    }),
  discountPrice: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional()
    .custom((value, helpers) => {
      if (value !== null && value !== undefined) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) return helpers.message('Discount price must have at most 2 decimal places');

        const price = helpers.state.ancestors[0].price;
        if (price !== undefined && value >= price) return helpers.message('Discount price must be less than the original price');
      }
      return value;
    })
    .messages({
      'number.min': 'Discount price must be greater than or equal to 0'
    }),
  quantity: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Quantity must be greater than or equal to 0',
      'number.integer': 'Quantity must be greater than or equal to 0',
      'number.min': 'Quantity must be greater than or equal to 0',
      'any.required': 'Quantity must be greater than or equal to 0'
    })
});

export const updateProductSchema = Joi.object({
  sku: Joi.forbidden().messages({
    'any.unknown': 'SKU cannot be updated after creation'
  }),
  name: Joi.string()
    .trim()
    .min(3)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name must not exceed 200 characters'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow(null, '')
    .optional()
    .messages({
      'string.max': 'Description must not exceed 1000 characters'
    }),
  category: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Category must be at least 2 characters long',
      'string.max': 'Category must not exceed 100 characters'
    }),
  type: Joi.string()
    .valid('public', 'private')
    .optional()
    .messages({
      'any.only': 'Type must be either "public" or "private"'
    }),
  price: Joi.number()
    .positive()
    .precision(2)
    .optional()
    .custom((value, helpers) => {
      if (value <= 0) return helpers.error('number.positive');
      const decimalPlaces = (value.toString().split('.')[1] || '').length;
      if (decimalPlaces > 2) return helpers.message('Price must have at most 2 decimal places');
      return value;
    })
    .messages({
      'number.positive': 'Price must be greater than 0'
    }),
  discountPrice: Joi.number()
    .min(0)
    .precision(2)
    .allow(null)
    .optional()
    .custom((value, helpers) => {
      if (value !== null && value !== undefined) {
        const decimalPlaces = (value.toString().split('.')[1] || '').length;
        if (decimalPlaces > 2) return helpers.message('Discount price must have at most 2 decimal places');
      }
      return value;
    })
    .messages({
      'number.min': 'Discount price must be greater than or equal to 0'
    }),
  quantity: Joi.number()
    .integer()
    .min(0)
    .optional()
    .messages({
      'number.integer': 'Quantity must be greater than or equal to 0',
      'number.min': 'Quantity must be greater than or equal to 0'
    })
}).min(1);

export const queryParamsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  category: Joi.string().trim().optional(),
  type: Joi.string().valid('public', 'private').optional(),
  search: Joi.string().trim().optional(),
  sort: Joi.string().valid('name', 'price', 'quantity', 'createdAt').optional(),
  order: Joi.string().valid('asc', 'desc').default('asc'),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional()
});

export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: property === 'query'
    });

    if (error) {
      const details = error.details.map(detail => ({
        field: detail.path[0] || detail.context.key,
        message: detail.message
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

    if (property === 'query') req.validatedQuery = value;
    else if (property === 'body') req.validatedBody = value;
    else if (property === 'params') req.validatedParams = value;

    next();
  };
};
