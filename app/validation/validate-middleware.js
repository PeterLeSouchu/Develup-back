import ApiError from '../errors/error.js';

const validateSchema = (schema) => (req, _res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error.details);
      const message = error.details[0].message;
      console.log(message);
      return next(new ApiError(message, 400));
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default validateSchema;
