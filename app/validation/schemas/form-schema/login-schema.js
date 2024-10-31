import Joi from 'joi';
import { emailSchema, passwordSchema } from './inputs-schema';

export const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});
