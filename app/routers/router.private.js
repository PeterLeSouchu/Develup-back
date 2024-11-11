import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import userController from '../controllers/user-controller.js';
import projectController from '../controllers/project-controller.js';
import technologieController from '../controllers/technologie-controller.js';
const privateRouter = Router();

privateRouter.use(jwtMiddleware);

privateRouter.post('/api/logout', tryCatchMiddleware(userController.logout));
privateRouter.post(
  '/api/search',
  tryCatchMiddleware(projectController.searchProject)
);
privateRouter.get(
  '/api/projects',
  tryCatchMiddleware(projectController.defaultProjects)
);
privateRouter.get(
  '/api/technologies',
  tryCatchMiddleware(technologieController.defaultTechnologies)
);

privateRouter.get('/');
export default privateRouter;
