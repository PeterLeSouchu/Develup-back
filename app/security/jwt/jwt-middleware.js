import jwt from 'jsonwebtoken';
import ApiError from '../../errors/error.js';
import userDatamapper from '../../datamappers/user-datamapper.js';

const jwtMiddleware = async (req, _res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      console.log('pas de token');
      return next(
        new ApiError(
          'Une erreur inattendue est survenue, essayez de vous reconnecter pour résoudre ce problème',
          401
        )
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const userExist = await userDatamapper.findById(payload.id);
    if (!userExist) {
      throw new ApiError(
        'Une erreur inattendu est survenue, essayez de vous reconnecter pour résoudre ce problème',
        401
      );
    }
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(
        new ApiError('Votre session a expiré, veuillez vous reconnecter', 401)
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.log('token pas bon');
      return next(
        new ApiError(
          'Une erreur inattendue est survenue, essayez de vous reconnecter pour résoudre ce problème',
          401
        )
      );
    }
    next(error);
  }
};

export default jwtMiddleware;
