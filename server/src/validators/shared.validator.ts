import Joi from 'joi';

export const usernameSchema = Joi.string()
  .min(3)
  .max(20)
  .pattern(/^[a-zA-Z0-9_]+$/)
  .messages({
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 20 characters',
    'string.pattern.base':
      'Username can only contain letters, numbers, and underscores',
  });

export const emailSchema = Joi.string().email().max(100).messages({
  'string.email': 'Please provide a valid email address',
  'string.max': 'Email must not exceed 100 characters',
});

export const passwordSchema = Joi.string()
  .min(8)
  .max(25)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must not exceed 25 characters',
    'string.pattern.base':
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  });
