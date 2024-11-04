import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';

const jwtMiddleware = (req, _res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return next(new ApiError('Accès refusé', 401));
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(
        new ApiError('Votre session a expiré, veuillez vous reconnecter', 401)
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Accès refusé', 401));
    }
    next(error);
  }
};

export default jwtMiddleware;
