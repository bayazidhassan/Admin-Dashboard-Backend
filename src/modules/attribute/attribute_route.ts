import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeController } from './attribute_controller';
import { createAttributeValidationSchema } from './attribute_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('attribute:create'),
  validateRequest(createAttributeValidationSchema),
  AttributeController.createAttribute,
);

export const AttributeRoutes = router;
