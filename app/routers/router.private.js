import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import userController from '../controllers/user-controller.js';
import projectController from '../controllers/project-controller.js';
import technologieController from '../controllers/technologie-controller.js';
import projectSchemaCreated from '../validation/schemas/form-schema/project-created-schema.js';
import projectSchemaEditeded from '../validation/schemas/form-schema/project-edited-schema.js';
import validateSchema from '../validation/validate-middleware.js';
import { uploadMiddleware } from '../upload/multer-config.js';
import { cloudinaryMiddleware } from '../upload/cloudinary-middleware.js';

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
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(projectSchemaCreated),
  tryCatchMiddleware(projectController.createProject)
);

privateRouter.patch(
  '/api/project/:slug',
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(projectSchemaEditeded),
  tryCatchMiddleware(projectController.editProject)
);

privateRouter.patch(
  '/api/edit-profile-image',
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  tryCatchMiddleware(userController.editProfileImage)
);

privateRouter.get(
  '/api/personal-projects',
  csrfMiddleware,
  tryCatchMiddleware(projectController.personalProjects)
);

privateRouter.get(
  '/api/personal-profile',
  tryCatchMiddleware(projectController.personalProfile)
);

privateRouter.get(
  '/api/technologies',
  tryCatchMiddleware(technologieController.defaultTechnologies)
);

privateRouter.get(
  '/api/project/:slug',
  tryCatchMiddleware(projectController.detailsProjectBySlug)
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
