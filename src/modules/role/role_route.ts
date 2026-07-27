import { Router } from 'express';

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
  validateRequest(createRoleValidationSchema),
  RoleController.createRole,
);

router.get('/', RoleController.getRoles);

router.get(
  '/:id',
  validateRequest(getRoleByIdValidationSchema),
  RoleController.getRoleById,
);

router.patch('/:id/grant-all', RoleController.grantAllPermissions);

router.patch(
  '/:id',
  validateRequest(updateRoleValidationSchema),
  RoleController.updateRole,
);

router.delete(
  '/:id',
  validateRequest(getRoleByIdValidationSchema),
  RoleController.deleteRole,
);

export const RoleRoutes = router;
