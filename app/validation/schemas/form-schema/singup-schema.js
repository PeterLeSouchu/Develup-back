import Joi from 'joi';
import {
  emailSchema,
  pseudoSchema,
  passwordSchema,
  cguSchema,
} from '../inputs-schema.js';

const signupSchema = Joi.object({
  email: emailSchema,
  pseudo: pseudoSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
  cgu: cguSchema,
});

export default signupSchema;
