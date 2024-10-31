import Joi from 'joi';
import { emailSchema } from './inputs-schema';

export const forgotPasswordSchema = Joi.object({
  email: emailSchema,
});
