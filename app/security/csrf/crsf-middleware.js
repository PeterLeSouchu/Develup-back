import ApiError from '../../errors/error.js';
import { doubleCsrfProtection } from './csrf-congig.js';

const csrfMiddleware = (req, res, next) => {
  try {
    console.log('on est dans le middleware csrf');
    doubleCsrfProtection(req, res, (err) => {
      if (err) {
        return next(
          new ApiError('Une erreur est survenue, merci de réessayer', 403)
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
