const tryCatchMiddleware = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (err) {
    console.log('On est dans le try catch');
    next(err);
  }
};

export default tryCatchMiddleware;
