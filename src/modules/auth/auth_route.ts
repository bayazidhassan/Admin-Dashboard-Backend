import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth_controller';
import { loginValidationSchema } from './auth_validation';

const router = Router();

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthController.login,
);

export const AuthRoutes = router;
