import { Router } from 'express';
// import privateRouter from './router.private';
import publicRouter from './router.public.js';
import { errorHandler } from '../errors/errorHandler.js';
const router = Router();

// router.use(privateRouter);
router.use(publicRouter);

router.use(errorHandler);

export default router;
