const tryCatchMiddleware =
  (...handlers) =>
  async (req, res, next) => {
    for (const handler of handlers) {
      try {
        await handler(req, res, next);
      } catch (error) {
        next(error);
      }
    }
  };

export default tryCatchMiddleware;
