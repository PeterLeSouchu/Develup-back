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

export const titleSchemaCreated = Joi.string()
  .required()
  .min(1)
  .max(30)
  .messages({
    'string.empty': 'le titre est requis',
    'string.max': 'Le titre ne peut pas posséder plus de 30 caractères',
  });

export const titleSchemaEdited = Joi.string().optional().max(30).messages({
  'string.max': 'Le titre ne peut pas posséder plus de 30 caractères',
});

export const rhythmSchemaCreated = Joi.string().required().min(1).messages({
  'string.empty': 'le rythme est requis',
});

export const rhythmSchemaEdited = Joi.string().optional();

export const descriptionSchemaCreated = Joi.string()
  .required()
  .min(1)
  .messages({
    'string.empty': 'la description est requise',
  });

export const descriptionSchemaEdited = Joi.string().optional();

// Here it's a array of objet (a object is a tehcno with id, name and image attribute) and this one arrive without being jsonStringify so we use Joi.string
export const technoSchema = Joi.string();

// here when user send no image, it's a special data so we just make Joi.any, and when user send image multer already filtered type and size + there's is a zod verification for image in front
export const imageSchema = Joi.any().optional();

export const pseudoSchemaEdited = Joi.string().optional().max(30).messages({
  'string.empty': 'le pseudo est requis',
  'string.max': 'Le pseudo ne peut pas posséder plus de 30 caractères',
});

export const typeSchemaEdited = Joi.string().allow('').optional();
