import jwt from 'jsonwebtoken';
import ApiError from '../errors/error.js';

const jwtMiddleware = (req, _res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new ApiError('Accès refusé', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Il n'y a pas d'erreur de verif du token");
  req.user = decoded;
  next();
};

export default jwtMiddleware;
