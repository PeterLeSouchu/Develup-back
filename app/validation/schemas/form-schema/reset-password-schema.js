import Joi from 'joi';
import { passwordSchema } from '../inputs-schema.js';

export const resetPasswordSchema = Joi.object({
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});
