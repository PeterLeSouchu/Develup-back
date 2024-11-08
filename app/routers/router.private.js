import { Router } from 'express';
// import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
// import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import logoutController from '../controllers/privateController/logout-controller.js';
import projectController from '../controllers/privateController/project-controller.js';
import technologieController from '../controllers/privateController/technologie-controller.js';
const privateRouter = Router();

privateRouter.post('/api/logout', tryCatchMiddleware(logoutController.logout));
privateRouter.post(
  '/api/search',
  tryCatchMiddleware(projectController.searchProject)
);
privateRouter.get('/api/project', projectController.defaultProject);
privateRouter.get('/api/technologie', technologieController.defaultTechnologie);
export default privateRouter;
