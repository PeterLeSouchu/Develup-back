import Joi from 'joi';
import { emailSchema, passwordSchema, pseudoSchema } from './inputs-schema';

// Création du schéma d'inscription
export const signupSchema = Joi.object({
  email: emailSchema,
  pseudo: pseudoSchema,
  password: passwordSchema,
  passwordConfirm: passwordSchema,
});
