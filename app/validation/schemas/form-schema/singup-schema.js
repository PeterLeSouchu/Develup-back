import Joi from 'joi';
import { emailSchema, passwordSchema, pseudoSchema } from '../inputs-schema';

export const signupSchema = Joi.object({
  email: emailSchema,
  pseudo: pseudoSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});
