import cloudinary from './cloudinary-config.js';

export const cloudinaryMiddleware = (req, res, next) => {
  if (!req.file) {
    // we create this variable to know if user has deleted image, in order to delete image from db and cloudinary, but we use it only in edit project controller and edit profile controller
    console.log('image deleted');
    req.deletedImage = true;
    return next();
  }
  cloudinary.uploader
    .upload_stream((error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Erreur lors de l'upload sur Cloudinary" });
      }
      req.urlImage = result.secure_url;
      req.imageId = result.public_id;
      return next();
    })
    .end(req.file.buffer);
};
