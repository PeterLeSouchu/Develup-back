import multer from 'multer';
import ApiError from '../errors/error.js';

const storage = multer.memoryStorage();

// Verify type
const fileFilter = (req, file, cb) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!validTypes.includes(file.mimetype)) {
    return cb(
      new ApiError('Seuls les fichiers JPEG, PNG et WebP sont autorisés', 400),
      false
    );
  }
  return cb(null, true);
};

// Limit file
const limits = {
  fileSize: 5 * 1024 * 1024, // 5 Mo
};

// Initialize multer
const upload = multer({ storage, fileFilter, limits });

// Middleware multer to upload file and handler error
// BUT THIS DOESN'T WORK COMPLETELY, don't know what, if error is sizeFile it's ok, but  if error is  from fileFilter (not instanceof multer.MulterError ), response doesn't work and no response sent. However there's a zod verification type file in front-end
export const uploadMiddleware = (req, res, next) => {
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(
          new ApiError('Le fichier est trop volumineux, 5 Mo maximum', 400)
        );
      }
      return next(
        new ApiError('Seuls les fichiers JPEG, PNG et WebP sont autorisés', 400)
      );
    }
    // If image is in form, it's mean user change image, and if value is '[undefined]', it's mean user has deleted image and send form with no image'
    // In front with React Hook Form, if user send form without image the req.body.image = '[object FileList]', but if user delete image, we reset image input, and req.body.image = 'undefined'

    if (req.body.image === 'undefined') {
      // we create this variable to know if user has deleted image, in order to delete image from db and cloudinary, but we use it only in edit project controller and edit profile controller
      req.deletedImage = true;
    }
    next();
  });
};
