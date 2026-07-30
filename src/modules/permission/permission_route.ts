import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { PermissionController } from './permission_controller';
import {
  createGroupValidationSchema,
  deleteGroupValidationSchema,
  getGroupByIdValidationSchema,
  updateGroupValidationSchema,
} from './permission_validation';

const router = Router();

router.post(
  '/groups',
  authenticate,
  authorize('permission:create'),
  validateRequest(createGroupValidationSchema),
  PermissionController.createGroup,
);
router.get(
  '/groups',
  authenticate,
  authorize('permission:read'),
  PermissionController.getGroups,
);
router.get(
  '/groups/:id',
  authenticate,
  authorize('permission:read'),
  validateRequest(getGroupByIdValidationSchema),
  PermissionController.getGroupById,
);
router.patch(
  '/groups/:id',
  authenticate,
  authorize('permission:update'),
  validateRequest(updateGroupValidationSchema),
  PermissionController.updateGroup,
);
router.delete(
  '/groups/:id',
  authenticate,
  authorize('permission:delete'),
  validateRequest(deleteGroupValidationSchema),
  PermissionController.deleteGroup,
);

export const PermissionRoutes = router;
