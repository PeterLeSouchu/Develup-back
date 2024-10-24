import { Router } from 'express';
import privateRouter from './router.private';
import publicRouter from './router.public';
const router = Router();

router.use(privateRouter);
router.use(publicRouter);
