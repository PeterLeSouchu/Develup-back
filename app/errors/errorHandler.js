export function errorHandler(error, _req, res) {
  console.log(error);
  const { message, title, status } = error;

  // If personalized error
  if (error instanceof ApiError) {
    res.status(error.status).json({
      title,
      message,
      status,
    });
  } else {
    res
      .status(500)
      .json({ message: 'Erreur innatendue, veuillez réessayer plus tard' });
  }
}
