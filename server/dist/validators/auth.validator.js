import Joi from 'joi';
import { usernameSchema, emailSchema, passwordSchema, } from './shared.validator.js';
export const registerUserValidator = {
    body: Joi.object({
        username: usernameSchema.required().messages({
            'any.required': 'Username is required',
        }),
        email: emailSchema.required().messages({
            'any.required': 'Email is required',
        }),
        password: passwordSchema.required().messages({
            'any.required': 'Password is required',
        }),
        local_currency: Joi.string().length(3).default('USD').messages({
            'string.length': 'Currency code must be exactly 3 characters',
        }),
    }),
};
export const loginUserValidator = {
    body: Joi.object({
        user_identifier: Joi.string().required().messages({
            'any.required': 'User identifier (email or username) is required',
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required',
        }),
    }),
};
export const refreshTokenValidator = {
    body: Joi.object({
        refreshToken: Joi.string().required().messages({
            'any.required': 'Refresh token is required',
        }),
    }),
};
