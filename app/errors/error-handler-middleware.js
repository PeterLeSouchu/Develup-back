import ApiError from './error.js';

export function errorHandler(error, _req, res, _next) {
  let status = 500;
  let message = 'Erreur inattendue, veuillez réessayer plus tard';

  if (error instanceof ApiError) {
    status = error.status || 500;
    message = error.message || 'Erreur inconnue';
  }
  console.log(
    `On est dans le middleware de gestion d\'erreur et voivi l\'erreur : ${error}`
  );

  return res.status(status).json({ message });
}
