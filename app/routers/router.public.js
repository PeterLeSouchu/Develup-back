import { Router } from 'express';
import authController from '../controllers/public-controllers/auth-controller.js';
const publicRouter = Router();

publicRouter.post('/api/login', authController.sendOTP);

export default publicRouter;
