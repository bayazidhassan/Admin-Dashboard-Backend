import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { UserController } from './user_controller';
import { createUserValidationSchema } from './user_validation';

const router = Router();

router.post(
  '/',
  validateRequest(createUserValidationSchema),
  UserController.createUser,
);

export const UserRoutes = router;
