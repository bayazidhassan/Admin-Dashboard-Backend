import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth_route';

const router = Router();

router.use('/auth', AuthRoutes);

export default router;
