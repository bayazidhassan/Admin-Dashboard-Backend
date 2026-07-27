import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth_route';
import { PermissionRoutes } from '../modules/permission/permission_route';
import { RoleRoutes } from '../modules/role/role_route';
import { UserRoutes } from '../modules/user/user_route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/permissions', PermissionRoutes);
router.use('/roles', RoleRoutes);
router.use('/users', UserRoutes);

export default router;
