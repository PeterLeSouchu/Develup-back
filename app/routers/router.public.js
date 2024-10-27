import { Router } from 'express';
import signupController from '../controllers/public-controllers/signup-controller.js';
const publicRouter = Router();

publicRouter.post('/api/signup/otp', signupController.sendOTP);
publicRouter.post('/api/signup/register', signupController.registerUser);

export default publicRouter;
