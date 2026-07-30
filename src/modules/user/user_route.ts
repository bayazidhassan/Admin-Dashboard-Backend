import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user_controller';
import {
  createUserValidationSchema,
  getUserByIdValidationSchema,
  updateUserStatusValidationSchema,
  updateUserValidationSchema,
} from './user_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('user:create'),
  validateRequest(createUserValidationSchema),
  UserController.createUser,
);

router.get('/', authenticate, authorize('user:read'), UserController.getUsers);

router.patch(
  '/:id/status',
  authenticate,
  authorize('user:update'),
  validateRequest(updateUserStatusValidationSchema),
  UserController.updateUserStatus,
);

router.get(
  '/:id',
  authenticate,
  authorize('user:read'),
  validateRequest(getUserByIdValidationSchema),
  UserController.getUserById,
);

router.patch(
  '/:id',
  authenticate,
  authorize('user:update'),
  validateRequest(updateUserValidationSchema),
  UserController.updateUser,
);

router.delete(
  '/:id',
  authenticate,
  authorize('user:delete'),
  validateRequest(getUserByIdValidationSchema),
  UserController.deleteUser,
);

export const UserRoutes = router;
