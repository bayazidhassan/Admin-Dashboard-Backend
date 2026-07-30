import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { RoleController } from './role_controller';
import {
  createRoleValidationSchema,
  getRoleByIdValidationSchema,
  updateRoleValidationSchema,
} from './role_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('role:create'),
  validateRequest(createRoleValidationSchema),
  RoleController.createRole,
);

router.get('/', authenticate, authorize('role:read'), RoleController.getRoles);

router.get(
  '/:id',
  authenticate,
  authorize('role:read'),
  validateRequest(getRoleByIdValidationSchema),
  RoleController.getRoleById,
);

router.patch(
  '/:id/grant-all',
  authenticate,
  authorize('role:update'),
  validateRequest(getRoleByIdValidationSchema),
  RoleController.grantAllPermissions,
);

router.patch(
  '/:id',
  authenticate,
  authorize('role:update'),
  validateRequest(updateRoleValidationSchema),
  RoleController.updateRole,
);

router.delete(
  '/:id',
  authenticate,
  authorize('role:delete'),
  validateRequest(getRoleByIdValidationSchema),
  RoleController.deleteRole,
);

export const RoleRoutes = router;
