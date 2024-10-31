// import { Router } from 'express';
// import signupController from '../controllers/public-controllers/signup-controller.js';
// import signinController from '../controllers/public-controllers/signin-controller.js';
// import forgotPasswordController from '../controllers/public-controllers/forgot-password-controller.js';
// import tryCatchMiddleware from '../errors/try-catch-middleware.js';
// import jwtMiddleware from '../security/jwt-middleware.js';
// import validateSchema from '../validation/validate-middleware.js';
// import otpSignupSchema from '../validation/schemas/form-schema/otp-schema.js';
// import signupSchema from '../validation/schemas/form-schema/singup-schema.js';

// const publicRouter = Router();

// // Use of TryCatchContoller to catch error, so we don't need to use try catch inside controllers or middlewares.
// const route = (method, path, fn) => {
//   publicRouter[method](path, tryCatchMiddleware(fn));
// };

// route(
//   'post',
//   '/api/signup/otp',
//   validateSchema(signupSchema),
//   signupController.sendOTP
// );

// // publicRouter.post(
// //   '/api/signup/otp',
// //   validateSchema(signupSchema),
// //   signupController.sendOTP
// // );
// route(
//   'post',
//   '/api/signup/register',
//   jwtMiddleware,
//   validateSchema(otpSignupSchema),
//   signupController.registerUser
// );
// route('post', '/api/signin', signinController.login);
// route('post', '/api/forgot-password', forgotPasswordController.sendResetLink);
// route('patch', '/api/reset-password', forgotPasswordController.resetPassword);

// export default publicRouter;
