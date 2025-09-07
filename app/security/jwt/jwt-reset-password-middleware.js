import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';

const jwtResetPasswordMiddleware = (req, _res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return next(new ApiError('Une erreur inattendue est survenue', 401));
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new ApiError("Le lien de réinitialisation n'est plus valide", 401)
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError('Une erreur inattendue est survenue', 401));
    }
    next(error);
  }
};

export default jwtResetPasswordMiddleware;
