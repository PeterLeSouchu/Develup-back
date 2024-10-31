import ApiError from '../errors/error.js';

const validateSchema = (schema) => (req, _res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    const message = error.details[0].message;
    return next(new ApiError(message, 400));
  }
  next();
};

export default validateSchema;
