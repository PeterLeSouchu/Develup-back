import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import userController from '../controllers/user-controller.js';
import projectController from '../controllers/project-controller.js';
import technologieController from '../controllers/technologie-controller.js';
import projectSchema from '../validation/schemas/form-schema/project-schema.js';
import validateSchema from '../validation/validate-middleware.js';
import { uploadMiddleware } from '../upload/multer-config.js';
import ApiError from '../errors/error.js';
import multer from 'multer';

const privateRouter = Router();

privateRouter.post('/api/logout', tryCatchMiddleware(userController.logout));
privateRouter.use(jwtMiddleware);

privateRouter.post(
  '/api/search',
  tryCatchMiddleware(projectController.searchProject)
);
privateRouter.get(
  '/api/projects',
  tryCatchMiddleware(projectController.defaultProjects)
);

privateRouter.post(
  '/api/project',
  uploadMiddleware,
  validateSchema(projectSchema),
  tryCatchMiddleware(projectController.createProject)
);

privateRouter.get(
  '/api/personal-projects',
  tryCatchMiddleware(projectController.personalProjects)
);

privateRouter.get(
  '/api/technologies',
  tryCatchMiddleware(technologieController.defaultTechnologies)
);

privateRouter.get(
  '/api/project/:slug',
  tryCatchMiddleware(projectController.detailsProject)
);

privateRouter.delete(
  '/api/project/:id',
  csrfMiddleware,
  tryCatchMiddleware(projectController.deleteProject)
);

privateRouter.get(
  '/api/user/:slug',
  tryCatchMiddleware(userController.detailsUser)
);

export default privateRouter;
