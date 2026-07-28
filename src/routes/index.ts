import { Router } from 'express';
import { AttributeRoutes } from '../modules/attribute/attribute_route';
import { AuthRoutes } from '../modules/auth/auth_route';
import { BrandRoutes } from '../modules/brand/brand_route';
import { CategoryRoutes } from '../modules/category/category_route';
import { MediaRoutes } from '../modules/media/media_route';
import { PermissionRoutes } from '../modules/permission/permission_route';
import { RoleRoutes } from '../modules/role/role_route';
import { UserRoutes } from '../modules/user/user_route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/permissions', PermissionRoutes);
router.use('/roles', RoleRoutes);
router.use('/users', UserRoutes);
router.use('/media', MediaRoutes);
router.use('/categories', CategoryRoutes);
router.use('/brands', BrandRoutes);
router.use('/attributes', AttributeRoutes);

export default router;
