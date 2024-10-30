import { Router } from 'express';
import signupController from '../controllers/public-controllers/signup-controller.js';
import signinController from '../controllers/public-controllers/signin-controller.js';
import forgotPasswordController from '../controllers/public-controllers/forgot-password-controller.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import { errorHandler } from '../errors/error-handler-middleware.js';

const publicRouter = Router();

// Use of TryCatchContoller to catch error, so we don't need to use try catch inside controllers
const route = (method, path, controller) => {
  publicRouter[method](path, tryCatchMiddleware(controller));
};

route('post', '/api/signup/otp', signupController.sendOTP);
route('post', '/api/signup/register', signupController.registerUser);
route('post', '/api/signin', signinController.login);
route('post', '/api/forgot-password', forgotPasswordController.sendResetLink);
route('patch', '/api/reset-password', forgotPasswordController.resetPassword);

export default publicRouter;
