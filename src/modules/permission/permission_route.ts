import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import validateRequest from '../../middlewares/validateRequest';
import { PermissionController } from './permission_controller';
import { createGroupValidationSchema } from './permission_validation';

const router = Router();

router.post(
  '/groups',
  authenticate,
  validateRequest(createGroupValidationSchema),
  PermissionController.createGroup,
);
router.get('/groups', PermissionController.getGroups);

export const PermissionRoutes = router;
