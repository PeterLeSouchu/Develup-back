import Joi from 'joi';
import { passwordSchema } from '../inputs-schema.js';

const resetPasswordSchema = Joi.object({
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});

export default resetPasswordSchema;
