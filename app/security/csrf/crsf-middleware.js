import ApiError from '../../errors/error.js';
import { doubleCsrfProtection } from './csrf-congig.js';

const csrfMiddleware = (req, res, next) => {
  try {
    doubleCsrfProtection(req, res, (err) => {
      if (err) {
        console.log(err);
        return next(
          new ApiError(
            "Une erreur inattendue s'est produite, veuillez réessayer plus tard",
            400
          )
        );
      }

      next();
    });
  } catch (error) {
    next(error);
  }
};

export default csrfMiddleware;
