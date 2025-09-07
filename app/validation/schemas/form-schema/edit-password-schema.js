import Joi from 'joi';
import { passwordSchema } from '../inputs-schema.js';

const editPasswordSchema = Joi.object({
  password: Joi.string().required().min(1).messages({
    'string.empty': 'Le mot de passe est requis.',
    'string.min': 'Le mot de passe doit avoir au moins 1 caractère.',
    'any.required': 'Le mot de passe est requis.',
  }),
  newPassword: passwordSchema,
  newPasswordConfirm: passwordSchema,
});

export default editPasswordSchema;
