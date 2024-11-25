import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';

const jwtSignupMiddleware = (req, _res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new ApiError('Une erreur inattendue est survenue', 401));
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new ApiError(
          "Le code OTP n'est plus valide, remplissez de nouveau le formulaire d'inscription pour recevoir un nouveau code OTP",
          401
        )
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError('Une erreur inattendue est survenue', 401));
    }
    next(error);
  }
};

export default jwtSignupMiddleware;
