import Joi from 'joi';

export const createMyStockValidator = {
  body: Joi.object({
    stock_code: Joi.string().min(1).max(30).required().messages({
      'any.required': 'Stock code is required',
      'string.min': 'Stock code must be at least 1 character long',
      'string.max': 'Stock code must not exceed 30 characters',
    }),
    quantity: Joi.number().integer().min(1).required().messages({
      'any.required': 'Quantity is required',
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be a whole number',
      'number.min': 'Quantity must be at least 1',
    }),
    purchase_price: Joi.number().precision(2).min(0.01).required().messages({
      'any.required': 'Purchase price is required',
      'number.base': 'Purchase price must be a number',
      'number.min': 'Purchase price must be at least 0.01',
      'number.precision': 'Purchase price can have maximum 2 decimal places',
    }),
    purchase_date: Joi.date().optional().messages({
      'date.base': 'Purchase date must be a valid date',
    }),
  }),
};

export const stockIdValidator = {
  params: Joi.object({
    stockId: Joi.number().integer().min(1).required().messages({
      'any.required': 'Stock ID is required',
      'number.base': 'Stock ID must be a number',
      'number.integer': 'Stock ID must be a whole number',
      'number.min': 'Stock ID must be at least 1',
    }),
  }),
};
