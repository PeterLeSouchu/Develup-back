import Joi from 'joi';
import { emailSchema, passwordSchema } from '../inputs-schema.js';

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

export default loginSchema;
