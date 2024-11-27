import { Router } from 'express';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import userController from '../controllers/user-controller.js';
import projectController from '../controllers/project-controller.js';
import technologieController from '../controllers/technologie-controller.js';
import conversationController from '../controllers/conversation-controller.js';
import validateSchema from '../validation/validate-middleware.js';
import { uploadMiddleware } from '../upload/multer-config.js';
import { cloudinaryMiddleware } from '../upload/cloudinary-middleware.js';
import profileEditedSchema from '../validation/schemas/form-schema/user-edited-schema.js';
import projectCreatedSchema from '../validation/schemas/form-schema/project-created-schema.js';
import projectEditedSchema from '../validation/schemas/form-schema/project-edited-schema.js';
import editPasswordSchema from '../validation/schemas/form-schema/edit-password-schema.js';

const privateRouter = Router();

privateRouter.post('/api/logout', tryCatchMiddleware(userController.logout));
// privateRouter.use(jwtMiddleware);

privateRouter.post(
  '/api/search',
  jwtMiddleware,
  tryCatchMiddleware(projectController.searchProject)
);
privateRouter.get(
  '/api/projects',
  jwtMiddleware,
  tryCatchMiddleware(projectController.defaultProjects)
);

privateRouter.post(
  '/api/project',
  jwtMiddleware,
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(projectCreatedSchema),
  tryCatchMiddleware(projectController.createProject)
);

privateRouter.patch(
  '/api/project/:slug',
  jwtMiddleware,
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(projectEditedSchema),
  tryCatchMiddleware(projectController.editProject)
);

privateRouter.patch(
  '/api/edit-profile',
  jwtMiddleware,
  csrfMiddleware,
  uploadMiddleware,
  cloudinaryMiddleware,
  validateSchema(profileEditedSchema),
  tryCatchMiddleware(userController.editProfile)
);

privateRouter.post(
  '/api/delete-account',
  jwtMiddleware,
  csrfMiddleware,
  tryCatchMiddleware(userController.deleteAccount)
);

privateRouter.get(
  '/api/personal-projects',
  jwtMiddleware,
  tryCatchMiddleware(projectController.personalProjects)
);

privateRouter.get(
  '/api/personal-profile',
  jwtMiddleware,
  tryCatchMiddleware(userController.personalProfile)
);

privateRouter.get(
  '/api/technologies',
  jwtMiddleware,
  tryCatchMiddleware(technologieController.defaultTechnologies)
);

privateRouter.get(
  '/api/project/:slug',
  jwtMiddleware,
  tryCatchMiddleware(projectController.detailsProjectBySlug)
);

privateRouter.delete(
  '/api/project/:id',
  jwtMiddleware,
  csrfMiddleware,
  tryCatchMiddleware(projectController.deleteProject)
);

privateRouter.get(
  '/api/user/:slug',
  jwtMiddleware,
  tryCatchMiddleware(userController.detailsUser)
);

privateRouter.post(
  '/api/edit-password',
  jwtMiddleware,
  csrfMiddleware,
  validateSchema(editPasswordSchema),
  tryCatchMiddleware(userController.editPassword)
);

privateRouter.post(
  '/api/open-conversation',
  jwtMiddleware,
  csrfMiddleware,
  tryCatchMiddleware(conversationController.openConversation)
);

privateRouter.get(
  '/api/conversations',
  jwtMiddleware,
  tryCatchMiddleware(conversationController.getAllConversations)
);

privateRouter.get(
  '/api/conversation/:id',
  jwtMiddleware,
  tryCatchMiddleware(conversationController.getOneConversation)
);

privateRouter.get(
  '/api/get-user-id',
  jwtMiddleware,
  tryCatchMiddleware(userController.getUserId)
);

export default privateRouter;
