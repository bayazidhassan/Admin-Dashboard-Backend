import { Router } from 'express';

import authenticate from '../../middlewares/authenticate';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { AttributeController } from './attribute_controller';
import {
  createAttributeValidationSchema,
  getAttributeByIdValidationSchema,
} from './attribute_validation';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('attribute:create'),
  validateRequest(createAttributeValidationSchema),
  AttributeController.createAttribute,
);

router.get(
  '/',
  authenticate,
  authorize('attribute:read'),
  AttributeController.getAttributes,
);

router.get(
  '/:id',
  authenticate,
  authorize('attribute:read'),
  validateRequest(getAttributeByIdValidationSchema),
  AttributeController.getAttributeById,
);

export const AttributeRoutes = router;
