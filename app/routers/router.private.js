import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import userController from '../controllers/user-controller.js';
import projectController from '../controllers/project-controller.js';
import technologieController from '../controllers/technologie-controller.js';
import validateSchema from '../validation/validate-middleware.js';
import { uploadMiddleware } from '../upload/multer-config.js';
import { cloudinaryMiddleware } from '../upload/cloudinary-middleware.js';
import profileEditedSchema from '../validation/schemas/form-schema/user-edited-schema.js';
import projectCreatedSchema from '../validation/schemas/form-schema/project-created-schema.js';
import projectEditedSchema from '../validation/schemas/form-schema/project-edited-schema.js';

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
  validateSchema(projectCreatedSchema),
  tryCatchMiddleware(projectController.createProject)
);

privateRouter.patch(
  '/api/project/:slug',
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(projectEditedSchema),
  tryCatchMiddleware(projectController.editProject)
);

privateRouter.patch(
  '/api/edit-profile',
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(profileEditedSchema),
  tryCatchMiddleware(userController.editProfile)
);

privateRouter.get(
  '/api/personal-projects',
  csrfMiddleware,
  tryCatchMiddleware(projectController.personalProjects)
);

privateRouter.get(
  '/api/personal-profile',
  tryCatchMiddleware(userController.personalProfile)
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
