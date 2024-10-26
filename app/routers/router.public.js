import { Router } from 'express';
import authController from '../controllers/public-controllers/auth-controller.js';
const publicRouter = Router();

publicRouter.post('/api/signup/otp', authController.sendOTP);
publicRouter.post('/api/signup/register', authController.registerUser);

export default publicRouter;
