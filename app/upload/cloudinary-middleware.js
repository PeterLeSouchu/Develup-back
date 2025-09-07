import cloudinary from './cloudinary-config.js';

export const cloudinaryMiddleware = (req, res, next) => {
  if (!req.file) {
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
