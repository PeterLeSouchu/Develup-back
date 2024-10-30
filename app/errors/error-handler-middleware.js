import ApiError from './error.js';

export function errorHandler(error, _req, res, _next) {
  const { message, title, status } = error;

  // Is this a custom error ?
  if (error instanceof ApiError) {
    res.status(status).json({
      title,
      message,
    });
  } else {
    res
      .status(500)
      .json({ message: 'Erreur innatendue, veuillez réessayer plus tard' });
  }
}
