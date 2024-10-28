import { Router } from 'express';
import signupController from '../controllers/public-controllers/signup-controller.js';
import signinController from '../controllers/public-controllers/signin-controller.js';
import forgotPasswordController from '../controllers/public-controllers/forgot-password-controller.js';
const publicRouter = Router();

publicRouter.post('/api/signup/otp', signupController.sendOTP);
publicRouter.post('/api/signup/register', signupController.registerUser);
publicRouter.post('/api/signin', signinController.login);
publicRouter.post(
  '/api/forgot-password',
  forgotPasswordController.sendResetLink
);
publicRouter.patch(
  '/api/reset-password',
  forgotPasswordController.resetPassword
);

export default publicRouter;
