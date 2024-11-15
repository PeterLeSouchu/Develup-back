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
import cloudinary from '../upload/cloudinary-config.js';
import fs from 'node:fs';

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

// privateRouter.post(
//   '/api/project',
//   uploadMiddleware,
//   (req, res, next) => {
//     console.log(req.file);
//     next();
//   },
//   function (req, res, next) {
//     cloudinary.uploader.upload(req.file.path, function (err, result) {
//       if (err) {
//         console.log(err);
//         return res.status(500).json({ message: 'problem' });
//       }
//       console.log(result);

//       // to delete image from uploads
//       fs.unlink(req.file.path, (err) => {
//         if (err) {
//           console.error(`Error removing file: ${err}`);
//           return;
//         }

//         console.log(`File ${req.file.path} has been successfully removed.`);
//       });

//       return res.status(200).json({ message: 'ok all is to good' });
//     });
//   },
//   validateSchema(projectSchema),
//   tryCatchMiddleware(projectController.createProject)
// );

privateRouter.post(
  '/api/project',
  uploadMiddleware,
  (req, res) => {
    if (!req.file) {
      return res.status(400).send('Aucun fichier téléchargé');
    }

    // Envoyer l'image directement à Cloudinary
    cloudinary.uploader
      .upload_stream((error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Erreur lors de l'upload sur Cloudinary" });
        }
        res.send({
          message: 'Image téléchargée avec succès!',
          url: result.secure_url,
        });
      })
      .end(req.file.buffer);
  },
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
