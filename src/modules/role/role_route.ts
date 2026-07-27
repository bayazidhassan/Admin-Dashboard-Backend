import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { RoleController } from './role_controller';
import { createRoleValidationSchema } from './role_validation';

const router = Router();

router.post(
  '/',
  validateRequest(createRoleValidationSchema),
  RoleController.createRole,
);

export const RoleRoutes = router;
