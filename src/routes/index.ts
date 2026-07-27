import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth_route';
import { PermissionRoutes } from '../modules/permission/permission_route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/permission', PermissionRoutes);

export default router;
