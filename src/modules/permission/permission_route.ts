import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { PermissionController } from './permission_controller';

const router = Router();

router.post('/groups', authenticate, PermissionController.createGroup);

export const PermissionRoutes = router;
