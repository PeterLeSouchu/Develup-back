import { Router } from 'express';
import userController from '../controllers/user-controller.js';
import tryCatchMiddleware from '../errors/try-catch-middleware.js';
import validateSchema from '../validation/validate-middleware.js';
import forgotPasswordSchema from '../validation/schemas/form-schema/forgot-password-schema.js';
import otpSignupSchema from '../validation/schemas/form-schema/otp-schema.js';
import signupSchema from '../validation/schemas/form-schema/singup-schema.js';
import resetPasswordSchema from '../validation/schemas/form-schema/reset-password-schema.js';
import jwtResetPasswordMiddleware from '../security/jwt/jwt-reset-password-middleware.js';
import jwtSignupMiddleware from '../security/jwt/jwt-signup-middleware.js';

const publicRouter = Router();

publicRouter.post(
  '/api/signup/otp',
  validateSchema(signupSchema),
  tryCatchMiddleware(userController.sendOTP)
);

publicRouter.post(
  '/api/signup/register',
  jwtSignupMiddleware,
  validateSchema(otpSignupSchema),
  tryCatchMiddleware(userController.registerUser)
);

publicRouter.post('/api/signin', tryCatchMiddleware(userController.login));

publicRouter.post(
  '/api/forgot-password',
  validateSchema(forgotPasswordSchema),
  tryCatchMiddleware(userController.sendResetLink)
);

publicRouter.patch(
  '/api/reset-password',
  jwtResetPasswordMiddleware,
  validateSchema(resetPasswordSchema),
  tryCatchMiddleware(userController.resetPassword)
);

export default publicRouter;
