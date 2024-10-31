import Joi from 'joi';
import { emailSchema } from '../inputs-schema.js';

const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});

export default forgotPasswordSchema;
