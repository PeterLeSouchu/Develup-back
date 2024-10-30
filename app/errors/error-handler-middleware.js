import ApiError from './error.js';
import jwt from 'jsonwebtoken';

export function errorHandler(error, _req, res, _next) {
  let status = 500;
  let message = 'Erreur inattendue, veuillez réessayer plus tard';

  if (error instanceof ApiError) {
    status = error.status || 500;
    message = error.message || 'Erreur inconnue';
  } else if (error instanceof jwt.TokenExpiredError) {
    status = 401;
    message = 'Votre session a expiré, veuillez vous reconnecter';
  } else if (error instanceof jwt.JsonWebTokenError) {
    status = 401;
    message = 'Accès refusé';
  }

  return res.status(status).json({ message });
}
