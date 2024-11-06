import { Router } from 'express';
import privateRouter from './router.private.js';
import publicRouter from './router.public.js';
import csrfTokenMethod from '../security/csrf/csrf-method.js';
const router = Router();

// call when user is connected with useEffect in react
router.get('/api/csrf-token', csrfTokenMethod);

router.use(privateRouter);
router.use(publicRouter);

export default router;
