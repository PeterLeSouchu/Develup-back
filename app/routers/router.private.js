import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import logoutController from '../controllers/privateController/logout-controller.js';
const privateRouter = Router();

privateRouter.post(
  '/api/logout',
  (req, res, next) => {
    console.log(req.headers['x-csrf-token']);
    next();
  },
  jwtMiddleware,
  csrfMiddleware,
  tryCatchMiddleware(logoutController.logout)
);
export default privateRouter;
