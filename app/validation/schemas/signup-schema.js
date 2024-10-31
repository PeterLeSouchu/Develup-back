const schema = Joi.object({
  password: Joi.string()
    .required()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[@$!%*?&.]/)
    .messages({
      'string.empty': 'Le mot de passe est requis.',
      'string.pattern.base':
        'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial (comme @, $, !, %, *, ?, &, ou .).',
    }),
});
