import { Router } from 'express';
// import privateRouter from './router.private';
import publicRouter from './router.public.js';
const router = Router();

// router.use(privateRouter);
router.use(publicRouter);

export default router;
