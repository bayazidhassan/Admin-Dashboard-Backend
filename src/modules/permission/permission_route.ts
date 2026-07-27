import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { PermissionController } from './permission_controller';

const router = Router();

router.post('/groups', authenticate, PermissionController.createGroup);
router.get('/groups', PermissionController.getGroups);

export const PermissionRoutes = router;
