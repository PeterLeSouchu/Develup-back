import jwt from 'jsonwebtoken';
import ApiError from '../errors/error.js';

const jwtMiddleware = (req, _res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new ApiError('Accès refusé', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

export default jwtMiddleware;
