import { stockTypes } from '@/services/yahooService';
import Joi from 'joi';

export const stockCodeSchema = Joi.object({
  stockCode: Joi.string().trim().min(1).max(50).required().messages({
    'string.base': 'Stock code must be a string',
    'string.empty': 'Stock code is required',
    'string.min': 'Stock code must be at least 1 character long',
    'string.max': 'Stock code must not exceed 50 characters',
    'any.required': 'Stock code is required',
  }),
});

export const stockQuerySchema = Joi.object({
  query: Joi.string().trim().min(1).max(50).required().messages({
    'string.base': 'Query must be a string',
    'string.empty': 'Query is required',
    'string.min': 'Query must be at least 1 character long',
    'string.max': 'Query must not exceed 50 characters',
    'any.required': 'Query is required',
  }),
});

export const stockTypeSchema = Joi.object({
  type: Joi.string()
    .valid(...stockTypes)
    .default(stockTypes[0])
    .messages({
      'any.only':
        'Stock type must be one of: most_actives, day_gainers, day_losers',
    }),
});
