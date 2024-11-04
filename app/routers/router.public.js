import { Router } from 'express';
import signupController from '../controllers/public-controllers/signup-controller.js';
import signinController from '../controllers/public-controllers/signin-controller.js';
import forgotPasswordController from '../controllers/public-controllers/forgot-password-controller.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import jwtMiddleware from '../security/jwt/jwt-middleware.js';
import validateSchema from '../validation/validate-middleware.js';
import otpSignupSchema from '../validation/schemas/form-schema/otp-schema.js';
import signupSchema from '../validation/schemas/form-schema/singup-schema.js';
import csrfMiddleware from '../security/csrf/crsf-middleware.js';
import jwtResetPasswordMiddleware from '../security/jwt/jwt-reset-password-middleware.js';

const publicRouter = Router();

publicRouter.post(
  '/api/signup/otp',
  validateSchema(signupSchema),
  tryCatchMiddleware(signupController.sendOTP)
);

publicRouter.post(
  '/api/signup/register',
  jwtMiddleware,
  validateSchema(otpSignupSchema),
  tryCatchMiddleware(signupController.registerUser)
);

publicRouter.post(
  '/api/signin',
  // csrfMiddleware,
  tryCatchMiddleware(signinController.login)
);

publicRouter.post(
  '/api/forgot-password',
  tryCatchMiddleware(forgotPasswordController.sendResetLink)
);

publicRouter.patch(
  '/api/reset-password',
  jwtResetPasswordMiddleware,
  tryCatchMiddleware(forgotPasswordController.resetPassword)
);

export default publicRouter;
