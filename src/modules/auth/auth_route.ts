import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth_controller';
import { loginValidationSchema } from './auth_validation';

const router = Router();

router.post(
  '/login',
  validateRequest(loginValidationSchema),
  AuthController.login,
);
router.get('/session', authenticate, AuthController.session);
router.post('/refresh', AuthController.refreshToken);

export const AuthRoutes = router;
