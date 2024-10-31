import ApiError from '../errors/error.js';

const validateSchema = (schema) => (req, _res, next) => {
  try {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      const message = error.details[0].message;
      return next(new ApiError(message, 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateSchema;
