import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth_route';
import { PermissionRoutes } from '../modules/permission/permission_route';
import { RoleRoutes } from '../modules/role/role_route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/permission', PermissionRoutes);
router.use('/roles', RoleRoutes);

export default router;
