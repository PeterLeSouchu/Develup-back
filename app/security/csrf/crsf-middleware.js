import ApiError from '../../errors/error.js';
import { doubleCsrfProtection } from './csrf-congig.js';

const csrfMiddleware = (req, res, next) => {
  try {
    console.log('on est dans le middleware csrf');
    doubleCsrfProtection(req, res, (err) => {
      if (err) {
        return next(
          new ApiError(
            "Une erreur inattendue s'est produite, veuillez réessayer plus tard",
            403
          )
        );
      }
      console.log('verif csrf terminé');
      next();
    });
  } catch (error) {
    next(error);
  }
};

export default csrfMiddleware;
