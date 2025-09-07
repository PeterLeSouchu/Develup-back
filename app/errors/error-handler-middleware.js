import ApiError from './error.js';

export function errorHandler(error, _req, res, _next) {
  let status = 500;
  let message = 'Erreur inattendue, veuillez réessayer plus tard';

  if (error instanceof ApiError) {
    status = error.status || 500;
    message = error.message || 'Erreur inconnue';
  }

  if (error.message === 'File too large') {
    (status = 400), (message = '3mo max');
  }

  console.log(
    `On est dans le middleware de gestion d\'erreur et voivi l\'erreur : ${error}`
  );

  // If it's not ApiError (our custom error class), we send basic response to make our app more secure (don't send info to the client).
  return res.status(status).json({ message });
}
