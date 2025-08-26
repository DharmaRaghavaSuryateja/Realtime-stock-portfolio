import Joi from 'joi';
import { usernameSchema, emailSchema } from './shared.validator.js';

export const updateProfileValidator = {
  body: Joi.object({
    username: usernameSchema,
    email: emailSchema,
  }),
};
