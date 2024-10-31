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
