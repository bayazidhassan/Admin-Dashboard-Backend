import { Router } from 'express';
import { PermissionController } from './permission_controller';

const router = Router();

router.post('/groups', PermissionController.createGroup);

export const PermissionRoutes = router;
