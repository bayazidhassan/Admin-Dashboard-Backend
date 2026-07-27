import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import validateRequest from '../../middlewares/validateRequest';
import { PermissionController } from './permission_controller';
import {
  createGroupValidationSchema,
  deletePermissionValidationSchema,
  updateGroupValidationSchema,
} from './permission_validation';

const router = Router();

router.post(
  '/groups',
  authenticate,
  validateRequest(createGroupValidationSchema),
  PermissionController.createGroup,
);
router.get('/groups', PermissionController.getGroups);
router.patch(
  '/groups/:id',
  validateRequest(updateGroupValidationSchema),
  PermissionController.updateGroup,
);
router.delete(
  '/groups/:id',
  validateRequest(deletePermissionValidationSchema),
  PermissionController.deletePermission,
);

export const PermissionRoutes = router;
