import { Router } from 'express';

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
  validateRequest(createUserValidationSchema),
  UserController.createUser,
);

router.get('/', UserController.getUsers);

router.patch(
  '/:id/status',
  validateRequest(updateUserStatusValidationSchema),
  UserController.updateUserStatus,
);

router.get(
  '/:id',
  validateRequest(getUserByIdValidationSchema),
  UserController.getUserById,
);

router.patch(
  '/:id',
  validateRequest(updateUserValidationSchema),
  UserController.updateUser,
);

export const UserRoutes = router;
