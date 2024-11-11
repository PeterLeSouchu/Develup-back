const tryCatchMiddleware = (controller) => async (req, res, next) => {
  try {
    await controller(req, res, next);
  } catch (error) {
    console.log(`voici lerreur : ${error}`);
    next(error);
  }
};

export default tryCatchMiddleware;
