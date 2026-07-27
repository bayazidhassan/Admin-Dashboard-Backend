import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { RoleController } from './role_controller';
import {
  createRoleValidationSchema,
  getRoleByIdValidationSchema,
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

export const RoleRoutes = router;
