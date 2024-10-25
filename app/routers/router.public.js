import { Router } from 'express';
import authController from '../controllers/public-controllers/auth-controller.js';
const publicRouter = Router();

publicRouter.post('/api/signup', authController.sendOTP);
publicRouter.get('/api/test', authController.test);

export default publicRouter;
