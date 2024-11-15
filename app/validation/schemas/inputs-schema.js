import Joi from 'joi';

export const emailSchema = Joi.string().required().email().messages({
  'string.empty': "L'email ne peut pas être vide.",
  'string.email': 'Veuillez entrer une adresse email valide.',
});

export const pseudoSchema = Joi.string()
  .required()
  .min(2)
  .max(30)
  .pattern(/^[^\s]+$/)
  .messages({
    'string.empty': 'Le pseudo ne peut pas être vide.',
    'string.pattern.base':
      "Le pseudo doit compter entre 2 et 30 caractères et ne doit pas contenir d'espace.",
  });

export const passwordSchema = Joi.string()
  .required()
  .min(8)
  .pattern(/[A-Z]/)
  .pattern(/[a-z]/)
  .pattern(/[0-9]/)
  .pattern(/[@$!%*?&.]/)
  .messages({
    'string.empty': 'Le mot de passe est requis.',
    'string.pattern.base':
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.',
  });

export const otpSchema = Joi.string()
  .length(6)
  .pattern(/^[0-9]+$/)
  .required()
  .messages({
    'string.empty': "L'OTP est requis.",
    'string.pattern.base': "L'OTP doit être composé uniquement de chiffres.",
  });

export const cguSchema = Joi.boolean().valid(true).required().messages({
  'any.required': "Vous devez accepter les conditions générales d'utilisation.",
});

// Here we use any. instead string. because data is not in json but multipart/formdata
export const titleSchema = Joi.string().required().min(1).max(30).messages({
  'any.required': 'Le titre est requis',
  'string.max': 'Le titre ne peut pas posséder plus de 30 caractères',
});

export const rhythmSchema = Joi.string().required().min(1).messages({
  'any.required': 'Le rythme est requis',
});

export const descriptionSchema = Joi.string().required().min(1).messages({
  'any.required': 'La description est requise',
});

export const technoSchema = Joi.string();

export const imageSchema = Joi.any().optional();
